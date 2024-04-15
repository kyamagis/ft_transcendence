import { Server, Socket } from 'socket.io'
import { allotGameParameter } from '../execPong/utils/allotGameParameter'
import servBall from '../execPong/utils/servBall'
import calcBallBehavior from '../execPong/utils/calcBallBehavior'
import calcPaddlePos from '../execPong/utils/calcPaddlePos'
import { MatchType, User } from '@prisma/client'
import { PongRepository } from '@/repository/pong.repository'
import {
  Ball,
  GameParameter,
  GameParameters,
  InvitationalMatchData,
  Player,
  PongSettingData,
  initPaddleMovement,
  initPlayer,
} from '../execPong/types'
import { FRAME, GAME_REDY_TIMER, GAME_START_TIMER } from '../execPong/constant'
import createMatchRecords from '../execPong/utils/createMatchRecords'

const cleanUp = (
  playerdataMap: Map<Socket, InvitationalMatchData>,
  socketMap: Map<number, Socket>,
  inviterSocket: Socket,
  inviteeSocket: Socket,
  inviterPlayer: Player,
  inviteePlayer: Player
) => {
  const inviterUserID = playerdataMap.get(inviterSocket).myUser.id
  const inviteeUserID = playerdataMap.get(inviteeSocket).myUser.id
  inviterSocket.leave
  inviteeSocket.leave
  socketMap.delete(inviterUserID)
  socketMap.delete(inviteeUserID)
  playerdataMap.delete(inviterSocket)
  playerdataMap.delete(inviteeSocket)
  inviterSocket.emit('gameover', inviterPlayer.score, inviteePlayer.score)
  inviteeSocket.emit('gameover', inviteePlayer.score, inviterPlayer.score)
}

const x_setInterval = (
  server: Server,
  pongRepo: PongRepository,
  playerdataMap: Map<Socket, InvitationalMatchData>,
  socketMap: Map<number, Socket>,
  roomName: string,
  gameParameterArray: GameParameter[],
  inviterSocket: Socket,
  inviteeSocket: Socket
) => {
  const gameParameter: GameParameters = allotGameParameter(gameParameterArray)
  const ball: Ball = servBall(gameParameter)
  const inviterPlayer: Player = initPlayer()
  const inviteePlayer: Player = initPlayer()
  const gameover = { flg: false }
  const inviterPaddleMovent = playerdataMap.get(inviterSocket).paddleMovent
  const inviteePaddleMovent = playerdataMap.get(inviteeSocket).paddleMovent
  let i = 0

  playerdataMap.get(inviterSocket).intervalID = setInterval(() => {
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
        gameParameter,
        ball,
        inviterPlayer,
        inviteePlayer,
        gameover
      )
      if (gameover.flg) {
        clearInterval(playerdataMap.get(inviterSocket).intervalID)
        createMatchRecords(
          pongRepo,
          inviterSocket,
          MatchType.InvitationalMatch,
          inviterPlayer.score,
          inviteePlayer.score,
          false,
          playerdataMap.get(inviterSocket).myUser.id,
          playerdataMap.get(inviteeSocket).myUser.id
        )
        cleanUp(
          playerdataMap,
          socketMap,
          inviterSocket,
          inviteeSocket,
          inviterPlayer,
          inviteePlayer
        )
        return
      }
      calcPaddlePos(gameParameter, inviterPlayer, inviterPaddleMovent)
      calcPaddlePos(gameParameter, inviteePlayer, inviteePaddleMovent)
      server
        .to(roomName)
        .emit('game_pos_and_point', ball, inviterPlayer, inviteePlayer)
    }
  }, FRAME)
}

const setInviterPlayerData = (
  playerdataMap: Map<Socket, InvitationalMatchData>,
  pongSettingData: PongSettingData,
  inviterSocket: Socket,
  myUser: User
) => {
  const role = pongSettingData.role
  const roomName = myUser.id.toString()
  const paddleMovent = initPaddleMovement()
  const opponentUserID = pongSettingData.opponentUserID
  const opponentSocket = undefined
  const intervalID = undefined
  const abstentionFlg = false
  playerdataMap.set(inviterSocket, {
    role,
    roomName,
    myUser,
    paddleMovent,
    opponentUserID,
    opponentSocket,
    intervalID,
    abstentionFlg,
  })
}

const setInviteePlayerData = (
  playerdataMap: Map<Socket, InvitationalMatchData>,
  pongSettingData: PongSettingData,
  inviterSocket: Socket,
  myUser: User,
  inviteeSocket: Socket
) => {
  const role = pongSettingData.role
  const roomName = pongSettingData.opponentUserID.toString()
  const paddleMovent = initPaddleMovement()
  const opponentUserID = pongSettingData.opponentUserID
  const opponentSocket = inviterSocket
  const intervalID = undefined
  const abstentionFlg = false
  playerdataMap.set(inviteeSocket, {
    role,
    roomName,
    myUser,
    paddleMovent,
    opponentUserID,
    opponentSocket,
    intervalID,
    abstentionFlg,
  })
  inviteeSocket.join(roomName)
}

const isValidAccess = (
  playerdataMap: Map<Socket, InvitationalMatchData>,
  socketMap: Map<number, Socket>,
  pongSettingData: PongSettingData
) => {
  const inviterUserID = pongSettingData.opponentUserID
  if (!socketMap.has(pongSettingData.opponentUserID)) {
    return false
  }
  const inviterSocket = socketMap.get(inviterUserID)
  if (!playerdataMap.has(inviterSocket)) {
    return false
  }
  if (
    playerdataMap.get(inviterSocket).opponentUserID !== pongSettingData.myUserID
  ) {
    return false
  }
  return true
}

const invitationalMatch = (
  server: Server,
  pongRepo: PongRepository,
  playerdataMap: Map<Socket, InvitationalMatchData>,
  socketMap: Map<number, Socket>,
  pongSettingData: PongSettingData,
  client: Socket,
  user: User
) => {
  if (pongSettingData.role === 'Inviter') {
    setInviterPlayerData(playerdataMap, pongSettingData, client, user)
    socketMap.set(user.id, client)
    client.emit('send_invitation_to_ivitee')
    return
  } else if (pongSettingData.role === 'Invitee') {
    if (!isValidAccess(playerdataMap, socketMap, pongSettingData)) {
      client.emit('error', 'Not Found Inviter')
      return
    }
    const inviterUserID = pongSettingData.opponentUserID
    const inviterSocket = socketMap.get(inviterUserID)
    playerdataMap.get(inviterSocket).opponentSocket = client
    setInviteePlayerData(
      playerdataMap,
      pongSettingData,
      inviterSocket,
      user,
      client
    )
    socketMap.set(user.id, client)
    const roomName = inviterUserID.toString()
    inviterSocket.join(roomName)
    x_setInterval(
      server,
      pongRepo,
      playerdataMap,
      socketMap,
      roomName,
      pongSettingData.gameParameterArray,
      inviterSocket,
      client
    )
  }
}

export default invitationalMatch
