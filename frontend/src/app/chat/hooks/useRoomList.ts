'use client'
import { ChatRoomWithOutPassword } from '../../types/types'
import { useState, Dispatch, SetStateAction } from 'react'

interface ReturnType {
  currentRoom: ChatRoomWithOutPassword | null
  setCurrentRoom: Dispatch<SetStateAction<ChatRoomWithOutPassword | null>>

  roomList: ChatRoomWithOutPassword[]
  setRoomList: Dispatch<SetStateAction<ChatRoomWithOutPassword[]>>

  showDM: boolean
  toggleShowDM: () => void
  showPublic: boolean
  toggleShowPublic: () => void
  showPrivate: boolean
  toggleShowPrivate: () => void
  showProtected: boolean
  toggleShowProtected: () => void
}

export function useRoomList(): ReturnType {
  // 現在のルームの状態を管理するための状態
  const [currentRoom, setCurrentRoom] =
    useState<ChatRoomWithOutPassword | null>(null) // 現在のルームの状態を管理

  // ルーム一覧を管理するための状態
  const [roomList, setRoomList] = useState<ChatRoomWithOutPassword[]>([])

  // 各ルームの表示状態を管理するための状態
  const [showDM, setShowDM] = useState(false)
  const [showPublic, setShowPublic] = useState(false)
  const [showPrivate, setShowPrivate] = useState(false)
  const [showProtected, setShowPasswordProtected] = useState(false)

  // 各セクションの表示をトグルする関数
  const toggleShowDM = () => setShowDM(!showDM)
  const toggleShowPublic = () => setShowPublic(!showPublic)
  const toggleShowPrivate = () => setShowPrivate(!showPrivate)
  const toggleShowProtected = () => setShowPasswordProtected(!showProtected)

  return {
    currentRoom,
    setCurrentRoom,
    roomList,
    setRoomList,
    showDM,
    toggleShowDM,
    showPublic,
    toggleShowPublic,
    showPrivate,
    toggleShowPrivate,
    showProtected,
    toggleShowProtected,
  }
}
