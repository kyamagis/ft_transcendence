import { apiClient } from '@/lib/axios/apiClient'
import { useAuth } from './useAuth'
import { registerStatus } from '@/lib/LoginStatus/registerLoginStatus'

export const useLogout = () => {
  const { setAuthStatus, userData } = useAuth()
  const logout = async () => {
    // ログアウトAPIを叩く
    try {
      if (!userData?.id) return
      await registerStatus(userData?.id, 'OFFLINE')
      await apiClient.get('/auth/logout')
    } catch (error) {
      console.error(error)
    }

    // ユーザーデータを無効化する
    setAuthStatus('UNAUTHORIZED')
  }

  return logout
}
