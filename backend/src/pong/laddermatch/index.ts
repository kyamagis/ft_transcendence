import { Server, Socket } from 'socket.io'
import { allotDefultGameParameter } from '../execPong/utils/allotGameParameter'
import servBall from '../execPong/utils/servBall'
import calcBallBehavior from '../execPong/utils/calcBallBehavior'
import calcPaddlePos from '../execPong/utils/calcPaddlePos'
import { MatchType, User } from '@prisma/client'
import { PongRepository } from '@/repository/pong.repository'
import {
  Ball,
  GameParameters,
  LadderMatchData,
  LadderRooms,
  Player,
  initPaddleMovement,
  initPlayer,
} from '../execPong/types'
import {
  DEFEAT_POINTS,
  FRAME,
  GAME_REDY_TIMER,
  GAME_START_TIMER,
  VICTORY_POINTS,
} from '../execPong/constant'
import { LadderLevel } from '../execPong/enums'
import addLadderPoints from './addLadderPoints'
import eraseFromArray from './eraseFromArray'
import convertFromPointsToLevels from './convertFromPointsToLevels'
import createMatchRecords from '../execPong/utils/createMatchRecords'

const cleanUp = (
  playerdataMap: Map<Socket, LadderMatchData>,
  enteredUserIDArray: number[],
  host: Socket,
  guest: Socket,
  hostPlayer: Player,
  guestPlayer: Player
) => {
  host.leave
  guest.leave
  eraseFromArray(enteredUserIDArray, playerdataMap.get(host).user.id)
  eraseFromArray(enteredUserIDArray, playerdataMap.get(guest).user.id)
  playerdataMap.delete(host)
  playerdataMap.delete(guest)
  host.emit('gameover', hostPlayer.score, guestPlayer.score)
  guest.emit('gameover', guestPlayer.score, hostPlayer.score)
}

const operateLadderPoints = (
  pongRepo: PongRepository,
  playerdataMap: Map<Socket, LadderMatchData>,
  host: Socket,
  guest: Socket,
  hostPlayer: Player,
  guestPlayer: Player
) => {
  let hostEarnedLadderpoints = VICTORY_POINTS
  let guestEarnedLadderpoints = DEFEAT_POINTS
  if (hostPlayer.score < guestPlayer.score) {
    hostEarnedLadderpoints = DEFEAT_POINTS
    guestEarnedLadderpoints = VICTORY_POINTS
  }
  const hostUserID = playerdataMap.get(host).user.id
  const guestUserID = playerdataMap.get(guest).user.id
  addLadderPoints(pongRepo, host, hostEarnedLadderpoints, hostUserID)
  addLadderPoints(pongRepo, guest, guestEarnedLadderpoints, guestUserID)
}

const x_setInterval = (
  server: Server,
  pongRepo: PongRepository,
  playerdataMap: Map<Socket, LadderMatchData>,
  enteredUserIDArray: number[],
  roomName: string,
  host: Socket,
  guest: Socket
) => {
  const defaultGameParameter: GameParameters = allotDefultGameParameter()
  const ball: Ball = servBall(defaultGameParameter)
  const hostPlayer: Player = initPlayer()
  const guestPlayer: Player = initPlayer()
  const gameover = { flg: false }
  const hostPaddleMovent = playerdataMap.get(host).paddleMovent
  const guestPaddleMovent = playerdataMap.get(guest).paddleMovent
  let i = 0

  playerdataMap.get(host).intervalID = setInterval(() => {
    if (i <= GAME_REDY_TIMER + GAME_START_TIMER) {
      if (i === 0) {
        server.to(roomName).emit('game_ready')
      }
      if (i === GAME_START_TIMER) {
        server.to(roomName).emit('game_start')
      }
      ++i
    } else {
      calcBallBehavior(
        defaultGameParameter,
        ball,
        hostPlayer,
        guestPlayer,
        gameover
      )
      if (gameover.flg) {
        clearInterval(playerdataMap.get(host).intervalID)
        operateLadderPoints(
          pongRepo,
          playerdataMap,
          host,
          guest,
          hostPlayer,
          guestPlayer
        )
        createMatchRecords(
          pongRepo,
          host,
          MatchType.LadderMatch,
          hostPlayer.score,
          guestPlayer.score,
          false,
          playerdataMap.get(host).user.id,
          playerdataMap.get(guest).user.id
        )
        cleanUp(
          playerdataMap,
          enteredUserIDArray,
          host,
          guest,
          hostPlayer,
          guestPlayer
        )
        return
      }
      calcPaddlePos(defaultGameParameter, hostPlayer, hostPaddleMovent)
      calcPaddlePos(defaultGameParameter, guestPlayer, guestPaddleMovent)
      server
        .to(roomName)
        .emit('game_pos_and_point', ball, hostPlayer, guestPlayer)
    }
  }, FRAME)
}

const setHostPlayerData = (
  playerdataMap: Map<Socket, LadderMatchData>,
  host: Socket,
  user: User,
  currentLevel: LadderLevel
) => {
  const role = 'Host'
  const roomName = host.id
  const paddleMovent = initPaddleMovement()
  const opponentSocket = undefined
  const intervalID = undefined
  const abstentionFlg = false
  playerdataMap.set(host, {
    role,
    roomName,
    user,
    currentLevel,
    paddleMovent,
    opponentSocket,
    intervalID,
    abstentionFlg,
  })
}

const setGuestPlayerData = (
  playerdataMap: Map<Socket, LadderMatchData>,
  guest: Socket,
  roomName: string,
  user: User,
  currentLevel: LadderLevel,
  opponentSocket: Socket
) => {
  const role = 'Guest'
  const paddleMovent = initPaddleMovement()
  const intervalID = undefined
  const abstentionFlg = false
  playerdataMap.set(guest, {
    role,
    roomName,
    user,
    currentLevel,
    paddleMovent,
    opponentSocket,
    intervalID,
    abstentionFlg,
  })
  guest.emit('room_setting', roomName, role)
  guest.join(roomName)
}

const laddermatch = (
  server: Server,
  pongRepo: PongRepository,
  playerdataMap: Map<Socket, LadderMatchData>,
  enteredUserIDArray: number[],
  ladderRooms: LadderRooms,
  client: Socket,
  user: User
) => {
  const ladderLevel = convertFromPointsToLevels(user.ladderpoints)
  if (ladderRooms[ladderLevel] === undefined) {
    setHostPlayerData(playerdataMap, client, user, ladderLevel)
    enteredUserIDArray.push(user.id)
    ladderRooms[ladderLevel] = client
  } else {
    const host = ladderRooms[ladderLevel]
    const roomName = ladderRooms[ladderLevel].id
    ladderRooms[ladderLevel] = undefined
    playerdataMap.get(host).opponentSocket = client
    setGuestPlayerData(playerdataMap, client, roomName, user, ladderLevel, host)
    enteredUserIDArray.push(user.id)
    host.join(roomName)
    host.emit('room_setting', roomName, 'Host')
    x_setInterval(
      server,
      pongRepo,
      playerdataMap,
      enteredUserIDArray,
      roomName,
      host,
      client
    )
  }
}

export default laddermatch
