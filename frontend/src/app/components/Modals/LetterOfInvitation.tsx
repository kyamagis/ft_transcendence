import { ScreenManagement } from '@/app/pong/enums'
import GameParameterButton from '@/app/pong/optionmode/GameParameterButton'
import { GameParameterRefArray } from '@/app/pong/types'

const LetterOfInvitation: React.FC<{
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
  gameParameterRefArray: GameParameterRefArray
}> = ({
  setScreenManagementState,
  gameParameterRefArray,
}) => {
  const inviteToPongHandler = () => {
      setScreenManagementState(ScreenManagement.InvitationalMatch)
  }

  const quitHandler = () => {
    setScreenManagementState(ScreenManagement.PongHome)
  }

  return (
    <div className="bg-black text-white">
      <p>{undefined}</p>
      {gameParameterRefArray.map((gameParameterRef, index) => (
        <div key={index}>
          <h2 className="gameparametername">{gameParameterRef.text}</h2>
          <div className="gameparameter">
            <span className="ponglh">L</span>
            <GameParameterButton gameParameterRef={gameParameterRef} />
            <span className="ponglh">H</span>
          </div>
        </div>
      ))}
      <div className="flex justify-center space-x-8 mt-4">
        <span>
          <button
            onClick={inviteToPongHandler}
            className="pongfont text-2xl text-white"
          >
            Invite
          </button>
        </span>
        <span>
          <button
            onClick={quitHandler}
            className="pongfont text-2xl text-white"
          >
            Quit
          </button>
        </span>
      </div>
    </div>
  )
}

export default LetterOfInvitation
