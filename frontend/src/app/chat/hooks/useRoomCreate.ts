import { useState } from 'react'
import { RoomType } from '../../types/types'

interface ReturnType {
  showModalRoomCreate: boolean
  openRoomCreateModal: () => void
  closeRoomCreateModal: () => void
  newRoomName: string
  setNewRoomName: (name: string) => void
  newRoomType: RoomType
  setNewRoomType: (type: RoomType) => void
  newRoomPassword: string
  setNewRoomPassword: (password: string) => void
}

export function useRoomCreate() {
  const [showModalRoomCreate, setShowModalRoomCreate] = useState(false)
  const [newRoomName, setNewRoomName] = useState('')
  const [newRoomType, setNewRoomType] = useState<RoomType>(RoomType.PUBLIC)
  const [newRoomPassword, setNewRoomPassword] = useState<string>('')
  // 新たに追加: RoomCreateモーダルを表示する関数
  const openRoomCreateModal = () => {
    setShowModalRoomCreate(true)
  }

  // 新たに追加: モーダルを非表示にする関数
  const closeRoomCreateModal = () => {
    setShowModalRoomCreate(false)
  }
  return {
    showModalRoomCreate,
    openRoomCreateModal,
    closeRoomCreateModal,
    newRoomName,
    setNewRoomName,
    newRoomType,
    setNewRoomType,
    newRoomPassword,
    setNewRoomPassword,
  }
}
