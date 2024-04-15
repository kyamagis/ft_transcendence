import { Dispatch, SetStateAction } from 'react'
import { ScreenManagement } from '../enums'
import { MessageWithUser } from '@/app/types/types'

export const PongError: React.FC<{
  errorMessageRef: React.MutableRefObject<string>
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({ errorMessageRef, setScreenManagementState }) => {
  const buttonHandler = () => {
    setScreenManagementState(ScreenManagement.PongHome)
  }
  return (
    <div className="pongbackground flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl text-center font-century-gothic">
        {errorMessageRef.current}
      </h1>
      <button
        className="text-4xl text-center font-century-gothic mt-10"
        onClick={buttonHandler}
      >
        OK
      </button>
    </div>
  )
}

export const InvitationalMatchError: React.FC<{
  setCurrentRoomHistory: Dispatch<SetStateAction<MessageWithUser[]>>
  messageId: number
  errorMessageRef: React.MutableRefObject<string>
}> = ({ setCurrentRoomHistory, messageId, errorMessageRef }) => {
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
      <h1 className="text-6xl text-center font-century-gothic">
        {errorMessageRef.current}
      </h1>
      <button
        className="text-4xl text-center font-century-gothic mt-10"
        onClick={buttonHandler}
      >
        OK
      </button>
    </div>
  )
}
