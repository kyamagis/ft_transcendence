'use client'
import React, { useState, useEffect, createContext, useContext } from 'react'
import { apiClient } from '@/lib/axios/apiClient'
import { registerStatus } from '@/lib/LoginStatus/registerLoginStatus'
import toast from 'react-hot-toast'

export interface UserData {
  id: number
  username?: string
  avatar?: Buffer
  ladderpoints?: number
  twoFASetting?: boolean
}

export type AuthStatus =
  | 'VALIDATING'
  | 'AUTHORIZED'
  | 'NEED_TWO_FACTOR'
  | 'UNAUTHORIZED'

const useAuthContext = (): AuthContextType => {
  const [userData, setUserData] = useState<UserData | undefined>(undefined)
  const [authStatus, setAuthStatus] = useState<AuthStatus>('VALIDATING')

  useEffect(() => {
    switch (authStatus) {
      case 'VALIDATING':
        const fetchUserData = async () => {
          try {
            const res = await apiClient.get('/auth/me')
            setUserData(res.data)
            if (res.data.needTwoFA) {
              setAuthStatus('NEED_TWO_FACTOR')
            } else if (res.data.username !== null) {
              // userNameがnullの場合は初期設定が必要
              setAuthStatus('AUTHORIZED')
            }
          } catch (error) {
            setAuthStatus('UNAUTHORIZED')
            console.error(error)
          }
        }
        fetchUserData()
        break
      case 'AUTHORIZED':
        if (!userData?.id) return
        registerStatus(userData?.id, 'IDLE')

        break
      case 'UNAUTHORIZED':
        setUserData(undefined)
    }
    return () => {}
  }, [authStatus, userData?.id])

  return { userData, authStatus, setAuthStatus, setUserData }
}

interface AuthContextType {
  userData?: UserData | undefined
  authStatus: AuthStatus
  setAuthStatus: React.Dispatch<React.SetStateAction<AuthStatus>>
  setUserData: React.Dispatch<React.SetStateAction<UserData | undefined>>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

interface Props {
  children: React.ReactNode
}

export const AuthProvider: React.FC<Props> = ({ children }) => {
  const authContext = useAuthContext()

  apiClient.interceptors.response.use(
    (response) => {
      return response
    },
    (error) => {
      if (error.response && error.response.status === 403) {
        authContext.setAuthStatus('UNAUTHORIZED')
      }
      return Promise.reject(error)
    }
  )

  return (
    <AuthContext.Provider value={authContext}>{children}</AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuthContext must be used within an AuthProvider')
  }
  return context
}
