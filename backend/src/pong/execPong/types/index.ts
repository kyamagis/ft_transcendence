import { Socket } from 'socket.io'
import { PADDLE_INIT_POS } from '../constant'
import { User } from '@prisma/client'
import { Direction, LadderLevel } from '../enums'

export type Ball = {
  x: number
  y: number
  vx: number
  vy: number
}

export type GameParameters = {
  ballSpeed: number
  paddleSpeed: number
  gravity: number
}

export type GameParameter = {
  text: string
  maxLevel: number
  gameParameter: number
}

export type LadderRooms = [
  Socket | undefined,
  Socket | undefined,
  Socket | undefined,
  Socket | undefined,
  Socket | undefined,
  Socket | undefined
]

export type PaddleMovement = {
  isKeyDown: Direction
  MovementDirection: Direction
}

export const initPaddleMovement = () => {
  return { isKeyDown: Direction.Neutral, MovementDirection: Direction.Neutral }
}

export type Player = {
  paddlePos: number
  paddleDir: Direction
  score: number
}

export const initPlayer = () => {
  return { paddlePos: PADDLE_INIT_POS, paddleDir: Direction.Neutral, score: 0 }
}

export type LadderMatchData = {
  role: string
  roomName: string
  user: User
  currentLevel: LadderLevel
  paddleMovent: PaddleMovement
  opponentSocket: Socket | undefined
  intervalID: NodeJS.Timer | undefined
  abstentionFlg: boolean
}

export type InvitationalMatchData = {
  role: string
  roomName: string
  myUser: User
  paddleMovent: PaddleMovement
  opponentUserID: number
  opponentSocket: Socket | undefined
  intervalID: NodeJS.Timer | undefined
  abstentionFlg: boolean
}

export type SocketMapValue = {
  intervalID: NodeJS.Timer
  myPaddle: PaddleMovement
  opponentPaddle: PaddleMovement
}

export type PongSettingData = {
  myUserID: number
  opponentUserID: number
  role: string // Inviter or Invitee
  gameParameterArray: GameParameter[]
}
