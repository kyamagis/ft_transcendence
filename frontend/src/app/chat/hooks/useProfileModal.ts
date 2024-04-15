import { useState } from 'react'

interface showUser {
  id: number
  name: string
}

export function useProfileModal() {
  // ユーザープロフィールのモーダルを表示
  const [showProfileModalUser, setShowProfileModalUserID] =
    useState<showUser | null>(null)
  const openProfileModal = (userID: number, userName: string) => {
    setShowProfileModalUserID({ id: userID, name: userName })
  }
  const closeProfileModal = () => {
    setShowProfileModalUserID(null)
  }

  return {
    showProfileModalUser,
    openProfileModal,
    closeProfileModal,
  }
}
