'use client'

import { useEffect, useRef, useState } from 'react'

import { BALL_DIAMETER, BG_WIDTH } from '../constant'
import { RoomInfo, Scores, initRoomInfoRef } from '../types'
import GameReady from '../computils/GameReady'
import { useAuth } from '@/app/auth'
import DuringAMatch from '../computils/DuringAMatch'
import MatchWaiting from '../computils/MatchWaiting'
import { ScreenManagement, VsModeScreenFlow } from '../enums'
import usePongObjects from '../hooks/usePongObjects'
import commonMatchSetting from '../funcutils/commonMatchSetting'
import cleanup from '../funcutils/cleanup'

const URL = 'http://localhost:3000/pong/laddermatch'

const LadderMatch: React.FC<{
  errorMessageRef: React.MutableRefObject<string>
  scoresRef: React.MutableRefObject<Scores>
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({ errorMessageRef, scoresRef, setScreenManagementState }) => {
  const [vsModeScreenFlowState, setVsModeScreenFlowState] = useState(
    VsModeScreenFlow.MatchWaiting
  )

  const { ballRef, myselfRef, opponentRef, setRenderingFlgState } =
    usePongObjects()
  const roomInfoRef = useRef<RoomInfo>(initRoomInfoRef())
  const matchResultHandlingFlgRef = useRef(false)
  const { userData } = useAuth()

  useEffect(() => {
    if (!userData?.id) {
      errorMessageRef.current = 'Could Not Get User ID'
      setScreenManagementState(ScreenManagement.Error)
      return
    }

    const userID = userData?.id
    const socket = commonMatchSetting(
      errorMessageRef,
      setScreenManagementState,
      URL,
      userID
    )

    socket.on('session_ok', () => {
      socket.emit('ladder_match', userID)
    })

    socket.on('room_setting', (roomName, role) => {
      roomInfoRef.current.roomName = roomName
      roomInfoRef.current.role = role
    })

    socket.on('game_ready', () => {
      setVsModeScreenFlowState(VsModeScreenFlow.GameReady)
    })

    socket.on('game_start', () => {
      setVsModeScreenFlowState(VsModeScreenFlow.DuringAMatch)
    })

    socket.on('game_pos_and_point', (ball, myself, opponent) => {
      ballRef.current = ball
      if (roomInfoRef.current.role === 'Host') {
        myselfRef.current = myself
        opponentRef.current = opponent
        console.log(myselfRef.current)
      } else if (roomInfoRef.current.role === 'Guest') {
        ballRef.current.x = BG_WIDTH - ballRef.current.x - BALL_DIAMETER
        myselfRef.current = opponent
        opponentRef.current = myself
      }
      setRenderingFlgState((prevState) => !prevState)
    })

    socket.on('errors_handled_after_game_over', (errorMessage) => {
      errorMessageRef.current = errorMessage
      matchResultHandlingFlgRef.current = true
    })

    socket.on('gameover', (myScore, opponentScore) => {
      if (matchResultHandlingFlgRef.current) {
        setScreenManagementState(ScreenManagement.Error)
      } else {
        scoresRef.current.myScore = myScore
        scoresRef.current.opponentScore = opponentScore
        setScreenManagementState(ScreenManagement.ResultScreen)
      }
    })

    return () => {
      cleanup(socket, userID)
    }
  }, [])

  switch (vsModeScreenFlowState) {
    case VsModeScreenFlow.MatchWaiting:
      return (
        <MatchWaiting
          setScreenManagementState={setScreenManagementState}
          reasonForWaiting={'Looking For An Opponent'}
        />
      )
    case VsModeScreenFlow.GameReady:
      return <GameReady />
    case VsModeScreenFlow.DuringAMatch:
      return (
        <DuringAMatch
          ballRef={ballRef}
          myselfRef={myselfRef}
          opponentRef={opponentRef}
        />
      )
    default:
      return <h1>Error</h1>
  }
}

export default LadderMatch
