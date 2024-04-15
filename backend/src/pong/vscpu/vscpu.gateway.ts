import {
  SubscribeMessage,
  WebSocketGateway,
  OnGatewayConnection,
  OnGatewayDisconnect,
  WebSocketServer,
} from '@nestjs/websockets'
import { Server, Socket } from 'socket.io'
import { Logger } from '@nestjs/common'
import vsCpu from './insdex'
import { GameParameter, PaddleMovement } from '../execPong/types'
import { Direction } from '../execPong/enums'
import pongSessionGuard from '../pongSessionGuard'
import { PongRepository } from '@/repository/pong.repository'
import { clearInterval } from 'timers'

@WebSocketGateway({
  namespace: '/pong/vscpu',
  cors: { origin: 'http://localhost:5000' },
})
export class VSCpuGateway implements OnGatewayConnection, OnGatewayDisconnect {
  @WebSocketServer() server: Server
  constructor(private readonly pongRepo: PongRepository) {}
  private socketMap = new Map<
    Socket,
    { intervalID: NodeJS.Timer; paddleMovement: PaddleMovement }
  >()
  private logger: Logger = new Logger('VSCpu')

  @SubscribeMessage('key_action')
  handleKey(client: Socket, keyAction: string) {
    if (!this.socketMap.has(client)) {
      return
    }
    if (keyAction === 'keyUp') {
      this.socketMap.get(client).paddleMovement.isKeyDown = Direction.Neutral
    } else if (keyAction === 'keyDownUp') {
      this.socketMap.get(client).paddleMovement.isKeyDown = Direction.Up
      this.socketMap.get(client).paddleMovement.MovementDirection = Direction.Up
    } else if (keyAction === 'keyDownDown') {
      this.socketMap.get(client).paddleMovement.isKeyDown = Direction.Down
      this.socketMap.get(client).paddleMovement.MovementDirection =
        Direction.Down
    }
  }

  @SubscribeMessage('vscpu')
  handleCpu(client: Socket, gameParameterArray: GameParameter[]) {
    this.logger.log('vscpu')
    vsCpu(this.socketMap, client, gameParameterArray)
    this.logger.log(this.socketMap.size)
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
    if (!this.socketMap.has(client)) {
      return
    }
    const intervalID = this.socketMap.get(client).intervalID
    clearInterval(intervalID)
    this.socketMap.delete(client)
    this.logger.log(this.socketMap.size)
  }
}
