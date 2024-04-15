import { Dispatch, useState } from 'react'
import { MessageWithUser } from '../../types/types'

interface ReturnType {
  currentRoomHistory: MessageWithUser[]
  setCurrentRoomHistory: Dispatch<MessageWithUser[]>
}

export function useMessageHistory() {
  const [currentRoomHistory, setCurrentRoomHistory] = useState<
    MessageWithUser[]
  >([])

  return {
    currentRoomHistory,
    setCurrentRoomHistory,
  }
}
