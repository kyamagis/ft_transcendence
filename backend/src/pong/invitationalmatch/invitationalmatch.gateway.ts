import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import { PongRepository } from '@/repository/pong.repository'
import { InvitationalMatchData, PongSettingData } from '../execPong/types'
import { Direction } from '../execPong/enums'
import pongSessionGuard from '../pongSessionGuard'
import invitationalMatch from '.'
import createMatchRecords from '../execPong/utils/createMatchRecords'
import { MatchType } from '@prisma/client'

@WebSocketGateway({
  namespace: '/pong/invitationalmatch',
  cors: { origin: 'http://localhost:5000' },
})
export class InvitationalMatchGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  constructor(private readonly pongRepo: PongRepository) {}
  private playerdataMap = new Map<Socket, InvitationalMatchData>()
  private socketMap = new Map<number, Socket>()
  private logger: Logger = new Logger('Invitational Match')

  @SubscribeMessage('key_action')
  handleKey(client: Socket, keyAction: string) {
    if (!this.playerdataMap.has(client)) {
      return
    }
    if (keyAction === 'keyUp') {
      this.playerdataMap.get(client).paddleMovent.isKeyDown = Direction.Neutral
    } else if (keyAction === 'keyDownUp') {
      this.playerdataMap.get(client).paddleMovent.isKeyDown = Direction.Up
      this.playerdataMap.get(client).paddleMovent.MovementDirection =
        Direction.Up
    } else if (keyAction === 'keyDownDown') {
      this.playerdataMap.get(client).paddleMovent.isKeyDown = Direction.Down
      this.playerdataMap.get(client).paddleMovent.MovementDirection =
        Direction.Down
    }
  }

  @SubscribeMessage('invitational_match')
  handleInvitationalMatch(client: Socket, pongSettingData: PongSettingData) {
    const user = this.pongRepo
      .getUserByID(pongSettingData.myUserID)
      .then((user) => {
        if (this.socketMap.has(pongSettingData.myUserID)) {
          client.emit('error', 'You Are Already Playing')
          return
        }
        invitationalMatch(
          this.server,
          this.pongRepo,
          this.playerdataMap,
          this.socketMap,
          pongSettingData,
          client,
          user
        )
        this.logger.log(user)
      })
      .catch(() => {
        this.logger.log('getUserByID: failed')
        client.emit('error', 'Not Found Your ID')
      })
    this.logger.log(`${this.playerdataMap.size}`)
  }

  @SubscribeMessage('session_guard')
  async handleSessionGuard(client: Socket, userID: number) {
    const userIdNum = await pongSessionGuard(
      this.pongRepo,
      this.logger,
      userID,
      client
    )
    if (userIdNum === undefined) {
      return
    }
    client.emit('session_ok')
  }

  handleConnection(client: Socket) {
    this.logger.log(`Client connected: ${client.id}`)
    client.emit('session_check')
  }

  handleDisconnect(client: Socket) {
    if (!this.playerdataMap.has(client)) {
      this.logger.log(`Client disconnected: ${client.id}`)
    } else if (this.isInviterQuitWaiting(client)) {
      this.cleanupForInviterQuitWaiting(client)
    } else if (this.isAbstained(client)) {
      this.cleanupForAbstained(client)
    }
    this.logger.log(`playerdata size: ${this.playerdataMap.size}`)
  }

  isInviterQuitWaiting(client: Socket) {
    const inviterData = this.playerdataMap.get(client)
    return (
      inviterData.role === 'Inviter' && inviterData.opponentSocket === undefined
    )
  }

  cleanupForInviterQuitWaiting(client: Socket) {
    const inviterUserID = this.playerdataMap.get(client).myUser.id
    this.socketMap.delete(inviterUserID)
    this.playerdataMap.delete(client)
  }

  isAbstained(client: Socket) {
    const myData = this.playerdataMap.get(client)
    return (
      myData.opponentSocket && this.playerdataMap.has(myData.opponentSocket)
    )
  }

  cleanupForAbstained(client: Socket) {
    const myData = this.playerdataMap.get(client)
    const opponentSocket = myData.opponentSocket
    const opponentData = this.playerdataMap.get(opponentSocket)
    client.leave
    if (myData.role === 'Inviter') {
      clearInterval(myData.intervalID)
    }
    if (!opponentData.abstentionFlg) {
      myData.abstentionFlg = true
      opponentSocket.emit('error', 'Opponent Abstained')
      this.logger.log(`Client disconnected: ${client.id}: I abstained`)
    } else if (opponentData.abstentionFlg) {
      const myUserID = this.playerdataMap.get(client).myUser.id
      const opponentUserID = this.playerdataMap.get(opponentSocket).myUser.id
      createMatchRecords(
        this.pongRepo,
        client,
        MatchType.InvitationalMatch,
        4,
        -1,
        true,
        myUserID,
        opponentUserID
      )
      this.socketMap.delete(myUserID)
      this.socketMap.delete(opponentUserID)
      this.playerdataMap.delete(client)
      this.playerdataMap.delete(opponentSocket)
      this.logger.log(`Client disconnected: ${client.id}: opponent abstained`)
    }
  }
}
