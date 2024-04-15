import React, { useState, useEffect } from 'react'
import { apiClient } from '@/lib/axios/apiClient'

export interface UserData {
  id: number
  username: string
  avatar?: Buffer
  twoFASetting: boolean
  twoFASecret: string
}

export const fetchAuthMe = async (userID: number): Promise<UserData> => {
  console.log('fetchUserData')
  const response = await apiClient.get(`/user/${userID}`)
  console.log(response.data)
  return response.data
}

export const useUser = (userID: number) => {
  const [userData, setUserData] = useState<UserData | null>(null)
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [error, setError] = useState<Error | null>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        const data = await fetchAuthMe(userID)
        setUserData(data)
      } catch (err: any) {
        setError(err)
      } finally {
        setIsLoading(false)
      }
    }
    fetchData()
  }, [userID])

  return { userData, isLoading, error }
}
