import GameParameterButton from './GameParameterButton'
import ModalProps from './ModalProps'

const OptionModeModal: React.FC<
  ModalProps & { setIsModalOpen: React.Dispatch<React.SetStateAction<boolean>> }
> = ({ modalContent, gameParameterRefArray, setIsModalOpen }) => {
  const backModal = () => {
    setIsModalOpen(false)
  }
  return (
    <div
      className="optionmodal focus:outline-none modal"
      role="menu"
      aria-orientation="vertical"
      tabIndex={-1}
    >
      <p>{modalContent}</p>
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
      <button onClick={backModal}>back</button>
    </div>
  )
}

export default OptionModeModal
