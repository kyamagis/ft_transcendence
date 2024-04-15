'use client'

import { apiClient } from '../axios/apiClient'
import toast from 'react-hot-toast'

export type LoginStatus = 'CHAT' | 'PONG' | 'OFFLINE' | 'IDLE'

export const registerStatus = async (
  myId: number,
  status: LoginStatus
): Promise<void> => {
  try {
    await apiClient.get(`/user-status/${myId}/${status}`)
  } catch (error: any) {
    if (error.response && error.response.data) {
      toast.error(error.response.data.message)
    } else {
      toast.error(error.message)
    }
  }
}
