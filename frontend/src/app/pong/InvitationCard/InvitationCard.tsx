import { Dispatch, SetStateAction, useEffect, useRef, useState } from 'react'
import EachGameParameter from './EachGameParameter'
import { ScreenManagement } from '../enums'
import InvitationalMatch from '../matchs/InvitationalMatch'
import { GameParameter, PongSettingData, Scores, initScoresRef } from '../types'
import axios from 'axios'
import { MessageWithUser } from '@/app/types/types'
import { InvitationalMatchError } from '../computils/PongError'
import { InvitationalMathcResult } from '../computils/ResultScreen'

type UpdateMessageDto = {
  messageId: number
  myUserId?: number
  opponentUserId?: number
  gameParametersJson?: string | undefined
}

const InvitationCard: React.FC<{
  setCurrentRoomHistory: Dispatch<SetStateAction<MessageWithUser[]>>
  messageId: number
  myUserID: number
  opponentUserID: number
  gameParametersJson: string
}> = ({
  setCurrentRoomHistory,
  messageId,
  myUserID,
  opponentUserID,
  gameParametersJson,
}) => {
  const gameParameterArray: GameParameter[] = JSON.parse(gameParametersJson)
  const errorMessageRef = useRef<string>('')
  const scoresRef = useRef<Scores>(initScoresRef())
  const [screenManagementState, setScreenManagementState] =
    useState<ScreenManagement>(ScreenManagement.PongHome)

  const joinHandler = () => {
    const updateMessageDto: UpdateMessageDto = {
      messageId: messageId,
    }
    axios
      .put('http://localhost:3000/message', updateMessageDto)
      .then(() => {
        setScreenManagementState(ScreenManagement.InvitationalMatch)
      })
      .catch((error) => {
        setScreenManagementState(ScreenManagement.InvitationalMatch)
        console.log(error)
      })
  }

  switch (screenManagementState) {
    case ScreenManagement.PongHome:
      return (
        <div className="bg-black text-white">
          <p>{'PONG'}</p>
          {gameParameterArray.map((gameParameter, index) => (
            <div key={index}>
              <EachGameParameter gameParameter={gameParameter} />
            </div>
          ))}
          <div className="flex justify-center space-x-8 mt-4">
            <button onClick={joinHandler} className="pongfont text-2xl">
              Join
            </button>
          </div>
        </div>
      )
    case ScreenManagement.InvitationalMatch:
      const pongSettingData: PongSettingData = {
        myUserID: myUserID,
        opponentUserID: opponentUserID,
        role: 'Invitee',
        gameParameterArray: gameParameterArray,
      }
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <InvitationalMatch
            pongSettingData={pongSettingData}
            errorMessageRef={errorMessageRef}
            scoresRef={scoresRef}
            setScreenManagementState={setScreenManagementState}
          />
        </div>
      )
    case ScreenManagement.Error:
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <InvitationalMatchError
            setCurrentRoomHistory={setCurrentRoomHistory}
            messageId={messageId}
            errorMessageRef={errorMessageRef}
          />
        </div>
      )
    case ScreenManagement.ResultScreen:
      return (
        <div className="fixed inset-0 flex items-center justify-center  bg-black bg-opacity-50 z-50">
          <InvitationalMathcResult
            setCurrentRoomHistory={setCurrentRoomHistory}
            messageId={messageId}
            scoresRef={scoresRef}
          />
        </div>
      )
    default:
      return <h1>Error</h1>
  }
}

export default InvitationCard
