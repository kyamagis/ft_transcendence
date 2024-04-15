import { Dispatch, SetStateAction } from 'react'
import { ScreenManagement } from '../enums'
import { Scores } from '../types'
import { MessageWithUser } from '@/app/types/types'

export const ResultScreen: React.FC<{
  scoresRef: React.MutableRefObject<Scores>
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({ scoresRef, setScreenManagementState }) => {
  const buttonHandler = () => {
    setScreenManagementState(ScreenManagement.PongHome)
  }
  return (
    <div className="pongbackground flex flex-col justify-center items-center h-screen">
      <div className="p-5 text-6xl text-center font-century-gothic">
        <span className="m-5">YOU</span>
        <span className="m-5">OPP</span>
      </div>
      <div className="p-5 text-6xl text-center font-century-gothic">
        <span className="mx-5">{scoresRef.current.myScore}</span>
        <span className="mx-6">-</span>
        <span className="mx-5">{scoresRef.current.opponentScore}</span>
      </div>
      <button
        className="text-4xl text-center font-century-gothic mt-10"
        onClick={buttonHandler}
      >
        OK
      </button>
    </div>
  )
}

export const InvitationalMathcResult: React.FC<{
  setCurrentRoomHistory: Dispatch<SetStateAction<MessageWithUser[]>>
  messageId: number
  scoresRef: React.MutableRefObject<Scores>
}> = ({ setCurrentRoomHistory, messageId, scoresRef }) => {
  const buttonHandler = () => {
    setCurrentRoomHistory((prev) => {
      const newCurrentRoomHistory = prev.map((message) => {
        if (messageId === message.id) {
          message.gameParametersJson = undefined
        }
        return message
      })
      return newCurrentRoomHistory
    })
  }
  return (
    <div className="pongbackground flex flex-col justify-center items-center h-screen">
      <div className="p-5 text-6xl text-center font-century-gothic">
        <span className="m-5">YOU</span>
        <span className="m-5">OPP</span>
      </div>
      <div className="p-5 text-6xl text-center font-century-gothic">
        <span className="mx-5">{scoresRef.current.myScore}</span>
        <span className="mx-6">-</span>
        <span className="mx-5">{scoresRef.current.opponentScore}</span>
      </div>
      <button
        className="text-4xl text-center font-century-gothic mt-10"
        onClick={buttonHandler}
      >
        OK
      </button>
    </div>
  )
}
