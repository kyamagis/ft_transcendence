import { apiClient } from '@/lib/axios/apiClient'
import React, { useEffect, useState } from 'react'
import toast from 'react-hot-toast'
import { useUser } from '@/app/hooks/useUser'
import { useAuth } from '@/app/auth'

type EditProfileModalProps = {
  onClose: () => void
  userID: number
}

export function EditProfileModal({ onClose, userID }: EditProfileModalProps) {
  const { userData, setUserData } = useAuth()
  const [username, setUsername] = useState('')
  const [avatar, setAvatar] = useState<File | null>(null)
  const [twoFASetting, setTwoFASetting] = useState(false)
  const [twoFAQR, setTwoFAQR] = useState<string | null>(null)

  useEffect(() => {
    if (
      !userData ||
      !userData.username ||
      userData.twoFASetting === undefined ||
      userData.twoFASetting === null
    ) {
      return
    }
    console.log('userData', userData)
    setUsername(userData.username)
    setTwoFASetting(userData.twoFASetting)
  }, [userData])

  const handleUsernameChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
  }
  const handleAvatarChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files) return
    setAvatar(e.target.files[0])
    console.log(e.target.files[0])
  }

  const handleTwoFAChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setTwoFASetting(e.target.checked)
  }

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()

    if (!username && !avatar) {
      toast.error('Please enter username or avatar')
      return
    }

    try {
      const formData = new FormData()
      formData.append('username', username)
      if (avatar) {
        formData.append('avatar', avatar)
      }
      formData.append('twoFASetting', String(twoFASetting))
      const response = await apiClient.put(`/user/${userID}`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      })
      toast.success('Update profile successfully')
      setUserData(response.data)
      onClose()
    } catch (error: any) {
      if (error.response && error.response.data) {
        console.log(
          'エラーレスポンスにボディ有り:',
          error.response.data.message
        )
        toast.error(error.response.data.message)
      } else {
        console.log('エラーレスポンスにボディ無し', error.message)
        toast.error(error.message)
      }
    }
  }

  const handleRequestQR = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault()
    const response = await apiClient.get('/auth/2fa/qr')
    if (response.status === 200) {
      setTwoFAQR(response.data)
    }
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="modal-content bg-white p-4 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-gray-800 text-center text-xl mb-2 font-bold border-b-2 border-gray-300">
          Edit Profile
        </div>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="username"
            >
              Username
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="username"
              type="text"
              placeholder="Username"
              value={username}
              onChange={handleUsernameChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="avatar"
            >
              Avatar
            </label>
            <input
              className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
              id="avatar"
              type="file"
              onChange={handleAvatarChange}
            />
          </div>

          <div className="mb-4">
            <label
              className="block text-gray-700 text-sm font-bold mb-2"
              htmlFor="twoFA"
            >
              2要素認証
            </label>
            <div className="flex items-center justify-between">
              <label>
                <input
                  className="mr-2"
                  id="twoFA"
                  type="checkbox"
                  checked={twoFASetting}
                  onChange={handleTwoFAChange}
                />
                Enable 2FA
              </label>
              {userData?.twoFASetting === true && twoFAQR === null ? (
                <button onClick={handleRequestQR}>QRコードを表示</button>
              ) : (
                twoFAQR !== null && <img src={twoFAQR} />
              )}
            </div>
          </div>

          <div className="flex items-center justify-between">
            <button
              className="bg-blue-500 hover:bg-blue-700 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="submit"
            >
              Update
            </button>
            <button
              className="bg-gray-700 hover:bg-gray-600 text-white py-2 px-4 rounded focus:outline-none focus:shadow-outline"
              type="button"
              onClick={onClose}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}
