'use client'

import { useEffect, useRef, useState } from 'react'

import { BALL_DIAMETER, BG_WIDTH } from '../constant'
import { PongSettingData, Scores } from '../types'
import GameReady from '../computils/GameReady'
import { useAuth } from '@/app/auth'
import DuringAMatch from '../computils/DuringAMatch'
import MatchWaiting from '../computils/MatchWaiting'
import { ScreenManagement, VsModeScreenFlow } from '../enums'
import usePongObjects from '../hooks/usePongObjects'
import commonMatchSetting from '../funcutils/commonMatchSetting'
import cleanup from '../funcutils/cleanup'
import axios from 'axios'
import { ChatRoomWithOutPassword } from '@/app/types/types'

const URL = 'http://localhost:3000/pong/invitationalmatch'

type CreateMessageDto = {
  myUserId: number
  opponentUserId: number
  gameParametersJson: string | undefined
}

const InvitationalMatch: React.FC<{
  inviteHandler?: (dmChatRoomInfo: ChatRoomWithOutPassword) => void
  pongSettingData: PongSettingData
  errorMessageRef: React.MutableRefObject<string>
  scoresRef: React.MutableRefObject<Scores>
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({
  inviteHandler,
  pongSettingData,
  errorMessageRef,
  scoresRef,
  setScreenManagementState,
}) => {
  const [vsModeScreenFlowState, setVsModeScreenFlowState] = useState(
    VsModeScreenFlow.MatchWaiting
  )

  const { ballRef, myselfRef, opponentRef, setRenderingFlgState } =
    usePongObjects()
  const role = pongSettingData.role
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

    socket.on('send_invitation_to_ivitee', () => {
      console.log('send_invitation_to_ivitee')
      const createMessageDto: CreateMessageDto = {
        myUserId: pongSettingData.myUserID,
        opponentUserId: pongSettingData.opponentUserID,
        gameParametersJson: JSON.stringify(pongSettingData.gameParameterArray),
      }
      axios
        .post('http://localhost:3000/message', createMessageDto)
        .then((res) => {
          if (inviteHandler) {
            inviteHandler(res.data)
          }
        })
        .catch((error) => {
          errorMessageRef.current = error.message
          setScreenManagementState(ScreenManagement.Error)
        })
    })

    socket.on('session_ok', () => {
      socket.emit('invitational_match', pongSettingData)
    })

    socket.on('game_ready', () => {
      setVsModeScreenFlowState(VsModeScreenFlow.GameReady)
    })

    socket.on('game_start', () => {
      setVsModeScreenFlowState(VsModeScreenFlow.DuringAMatch)
    })

    socket.on('game_pos_and_point', (ball, myself, opponent) => {
      ballRef.current = ball
      if (role === 'Inviter') {
        myselfRef.current = myself
        opponentRef.current = opponent
      } else if (role === 'Invitee') {
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
          reasonForWaiting={'Wating For Invitee'}
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

export default InvitationalMatch
