import { ScreenManagement } from '@/app/pong/enums'
import {
  GameParameterRefArray,
  PongSettingData,
  Scores,
  initScoresRef,
} from '@/app/pong/types'
import LetterOfInvitation from './LetterOfInvitation'
import InvitationalMatch from '@/app/pong/matchs/InvitationalMatch'
import gameParameterRefToNumber from '@/app/pong/funcutils/gameParameterRefToNumber'

import { UserData } from '@/app/auth/hooks/useAuth'
import { ChatRoomWithOutPassword } from '@/app/types/types'
import { useRef } from 'react'
import { PongError } from '@/app/pong/computils/PongError'
import { ResultScreen } from '@/app/pong/computils/ResultScreen'

const InvitationalMatchModals: React.FC<{
  onClose: () => void
  inviteHandler?: (dmChatRoomInfo: ChatRoomWithOutPassword) => void
  targetUserData: UserData
  myData: UserData
  screenManagementState: ScreenManagement
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
  errorMessageRef: React.MutableRefObject<string>
  gameParameterRefArray: GameParameterRefArray
}> = ({
  onClose,
  inviteHandler,
  targetUserData,
  myData,
  screenManagementState,
  setScreenManagementState,
  errorMessageRef,
  gameParameterRefArray,
}) => {
  const scoresRef = useRef<Scores>(initScoresRef())

  switch (screenManagementState) {
    case ScreenManagement.LetterOfInvitation:
      return (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <LetterOfInvitation
              setScreenManagementState={setScreenManagementState}
              gameParameterRefArray={gameParameterRefArray}
            />
          </div>
        </div>
      )
    case ScreenManagement.InvitationalMatch:
      const pongSettingData: PongSettingData = {
        myUserID: myData.id,
        opponentUserID: targetUserData.id,
        role: 'Inviter',
        gameParameterArray: gameParameterRefToNumber(gameParameterRefArray),
      }
      return (
        <div className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50">
          <InvitationalMatch
            inviteHandler={inviteHandler}
            pongSettingData={pongSettingData}
            errorMessageRef={errorMessageRef}
            scoresRef={scoresRef}
            setScreenManagementState={setScreenManagementState}
          />
        </div>
      )
    case ScreenManagement.Error:
      return (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <PongError
              errorMessageRef={errorMessageRef}
              setScreenManagementState={setScreenManagementState}
            />
          </div>
        </div>
      )
    case ScreenManagement.ResultScreen:
      return (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <ResultScreen
              scoresRef={scoresRef}
              setScreenManagementState={setScreenManagementState}
            />
          </div>
        </div>
      )
    default:
      return <h1>Error</h1>
  }
}

export default InvitationalMatchModals
