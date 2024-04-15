import { CENTER_OF_BG_X, CENTER_OF_BG_Y, PADDLE_INIT_POS } from '../constant'
import { Direction } from '../enums'

export type Ball = {
  x: number
  y: number
  vx: number
  vy: number
}

export const initBallRef = () => {
  return {
    x: CENTER_OF_BG_X,
    y: CENTER_OF_BG_Y,
    vx: 0,
    vy: 0,
  }
}

export type Player = {
  paddlePos: number
  paddleDir: Direction
  score: number
}

export const initPlayerRef = () => {
  return { paddlePos: PADDLE_INIT_POS, paddleDir: Direction.Neutral, score: 0 }
}

export type GameParameter = {
  text: string
  maxLevel: number
  gameParameter: number
}

export type GameParameterRef = {
  text: string
  maxLevel: number
  gameParameterRef: React.MutableRefObject<number>
}

export type GameParameterRefArray = Array<{
  text: string
  maxLevel: number
  gameParameterRef: React.MutableRefObject<number>
}>

export type RoomInfo = {
  roomName: string
  role: string
}

export const initRoomInfoRef = () => {
  return { roomName: 'none', role: 'none' }
}

export type PongSettingData = {
  myUserID: number
  opponentUserID: number
  role: string
  gameParameterArray: GameParameter[]
}

export type Scores = {
  myScore: number
  opponentScore: number
}

export const initScoresRef = () => {
  return { myScore: 0, opponentScore: 0 }
}
