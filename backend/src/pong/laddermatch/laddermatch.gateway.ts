import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import laddermatch from '.'
import { PongRepository } from '@/repository/pong.repository'
import eraseFromArray from './eraseFromArray'
import { LadderMatchData, LadderRooms } from '../execPong/types'
import { Direction } from '../execPong/enums'
import addLadderPoints from './addLadderPoints'
import { PENALTY_POINTS, VICTORY_POINTS } from '../execPong/constant'
import pongSessionGuard from '../pongSessionGuard'
import { MatchType } from '@prisma/client'
import createMatchRecords from '../execPong/utils/createMatchRecords'

@WebSocketGateway({
  namespace: '/pong/laddermatch',
  cors: { origin: 'http://localhost:5000' },
})
export class LadderMatchGateway
  implements OnGatewayConnection, OnGatewayDisconnect
{
  @WebSocketServer() server: Server
  constructor(private readonly pongRepo: PongRepository) {}
  private playerdataMap = new Map<Socket, LadderMatchData>()
  private enteredUserIDArray: number[] = []
  private ladderRooms: LadderRooms = [
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
    undefined,
  ]
  private logger: Logger = new Logger('Ladder Match')

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

  @SubscribeMessage('ladder_match')
  handleLadderMatch(client: Socket, userID: number) {
    const user = this.pongRepo
      .getUserByID(userID)
      .then((user) => {
        if (this.enteredUserIDArray.includes(user.id)) {
          client.emit('error', 'You Are Already Playing')
          return
        }
        laddermatch(
          this.server,
          this.pongRepo,
          this.playerdataMap,
          this.enteredUserIDArray,
          this.ladderRooms,
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
    } else if (this.isHostQuitWaiting(client)) {
      this.cleanupForHostQuitWaiting(client)
    } else if (this.isAbstained(client)) {
      this.cleanupForAbstained(client)
    }
    this.logger.log(
      `playerdata size: ${this.playerdataMap.size}, entry users: ${this.enteredUserIDArray}`
    )
  }

  isHostQuitWaiting(client: Socket) {
    const hostData = this.playerdataMap.get(client)
    return hostData.role === 'Host' && hostData.opponentSocket === undefined
  }

  cleanupForHostQuitWaiting(client: Socket) {
    const hostData = this.playerdataMap.get(client)
    if (this.ladderRooms[hostData.currentLevel] === client) {
      this.ladderRooms[hostData.currentLevel] = undefined
    }
    eraseFromArray(this.enteredUserIDArray, hostData.user.id)
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
    if (myData.role === 'Host') {
      clearInterval(myData.intervalID)
    }
    if (!opponentData.abstentionFlg) {
      myData.abstentionFlg = true
      opponentSocket.emit('error', 'Opponent Abstained')
      this.logger.log(`Client disconnected: ${client.id}: I abstained`)
    } else if (opponentData.abstentionFlg) {
      addLadderPoints(
        this.pongRepo,
        undefined,
        PENALTY_POINTS,
        opponentData.user.id
      )
      addLadderPoints(this.pongRepo, undefined, VICTORY_POINTS, myData.user.id)
      createMatchRecords(
        this.pongRepo,
        client,
        MatchType.LadderMatch,
        4,
        -1, // 棄権したUserのPoints
        true,
        this.playerdataMap.get(client).user.id,
        this.playerdataMap.get(opponentSocket).user.id
      )
      this.playerdataMap.delete(client)
      this.playerdataMap.delete(opponentSocket)
      eraseFromArray(this.enteredUserIDArray, myData.user.id)
      eraseFromArray(this.enteredUserIDArray, opponentData.user.id)
      this.logger.log(`Client disconnected: ${client.id}: opponent abstained`)
    }
  }
}
