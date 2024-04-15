import { Dispatch, useState } from 'react'

interface ReturnType {
  showModalProtectedRomm: boolean
  openPasswordInputModal: () => void
  closePasswordInputModal: () => void
  inputRoomPassword: string
  setInputRoomPassword: Dispatch<string>
}

export function useProtectedRoom(): ReturnType {
  const [showModalProtectedRomm, setShowModalProtectedRomm] = useState(false)
  const [inputRoomPassword, setInputRoomPassword] = useState('')
  const openPasswordInputModal = () => {
    setShowModalProtectedRomm(true)
  }
  const closePasswordInputModal = () => {
    setShowModalProtectedRomm(false)
  }

  return {
    showModalProtectedRomm,
    openPasswordInputModal,
    closePasswordInputModal,
    inputRoomPassword,
    setInputRoomPassword,
  }
}
