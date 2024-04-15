'use client'
import { useState, ChangeEventHandler, FormEventHandler } from 'react'
import { API_URL } from '@/config/constants'
import { useAuth } from '../hooks/useAuth'
import { apiClient } from '@/lib/axios/apiClient'

const AuthForm = () => {
  const { userData, authStatus, setAuthStatus } = useAuth()
  console.log(userData)
  switch (authStatus) {
    case 'UNAUTHORIZED':
      return <OAuthForm />
    case 'NEED_TWO_FACTOR':
      return <TwoFactorForm />
    case 'VALIDATING':
      const isNeedInitialSetting = userData?.username === null

      if (isNeedInitialSetting) {
        return <InitialSettingForm />
      } else {
        // loading中は何も表示しない
        return null
      }
    default:
      return null
  }
}

const TwoFactorForm = () => {
  // 2FAフォームを表示、APIで2FA認証成功したら、authStatusをAUTHORIZEDに変更
  const [formData, setFormData] = useState({
    token: '',
  })
  const { setAuthStatus } = useAuth()

  const handleInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await apiClient.post(`/auth/2fa/validate`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 201) {
        setAuthStatus('AUTHORIZED')
      } else {
        // TODO: エラー通知
      }
    } catch (error) {
      // TODO: エラー通知
      console.error('Error updating user profile:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">2要素認証</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Token
            </label>
            <input
              type="text"
              name="token"
              value={formData.token}
              onChange={handleInput}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

const OAuthForm = () => {
  const redirectFtAuth = async () => {
    window.location.href = `${API_URL}/auth/ft-oauth`
  }

  const redirectGoogleAuth = async () => {
    window.location.href = `${API_URL}/auth/google-oauth`
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Sign in</h2>
        <button
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full mb-2"
          onClick={redirectFtAuth}
        >
          Sign in with 42.
        </button>
        <button
          className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          onClick={redirectGoogleAuth}
        >
          Sign in with Google.
        </button>
      </div>
    </div>
  )
}

// TODO: 初期設定フォームを表示、APIでユーザー名を登録成功したら、authStatusをAUTHORIZEDに変更
const InitialSettingForm = () => {
  const [formData, setFormData] = useState({
    username: '',
  })
  const { userData, setAuthStatus } = useAuth()

  if (userData === undefined) return null

  const handleInput: ChangeEventHandler<
    HTMLInputElement | HTMLTextAreaElement
  > = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value })
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    try {
      const response = await apiClient.put(`/user/${userData.id}`, formData, {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (response.status === 200) {
        setAuthStatus('AUTHORIZED')
      } else {
        // TODO: エラー通知
      }
    } catch (error) {
      // TODO: エラー通知
      console.error('Error updating user profile:', error)
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="bg-white p-6 rounded-lg shadow-md w-80">
        <h2 className="text-2xl font-bold mb-4 text-center">Initial Setting</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              value={formData.username}
              onChange={handleInput}
              className="mt-1 p-2 w-full border rounded-md"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white font-bold py-2 px-4 rounded-full"
          >
            Submit
          </button>
        </form>
      </div>
    </div>
  )
}

export default AuthForm
