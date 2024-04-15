'use client'

import { useState, useEffect } from 'react'
import ModalProps from './ModalProps'
import OptionModeModalCore from './OptionModeModal'

const OptionMode: React.FC<ModalProps> = ({
  trigger,
  modalContent,
  gameParameterRefArray
}) => {
  const [isModalOpen, setIsModalOpen] = useState(false)

  const openModal = () => {
    setIsModalOpen(true)
  }

  const closeModal = (e: MouseEvent) => {
    if (
      e.target instanceof Element &&
      (e.target.closest('.modal') || e.target.closest('.trigger'))
    ) {
      return
    }
    setIsModalOpen(false)
  }

  useEffect(() => {
    window.addEventListener('click', closeModal)
    return () => {
      window.removeEventListener('click', closeModal)
    }
  }, [])

  return (
    <div>
      <div className="trigger" onClick={openModal}>
        {trigger}
      </div>
      {isModalOpen && (
        <OptionModeModalCore
          trigger={trigger}
          modalContent={modalContent}
          gameParameterRefArray={gameParameterRefArray}
          setIsModalOpen={setIsModalOpen}
        />
      )}
    </div>
  )
}

export default OptionMode
