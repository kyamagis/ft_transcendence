import { ChatRoomWithOutPassword, User } from '@/app/types/types'
import { apiClient } from '@/lib/axios/apiClient'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface AdminListDropDownProps {
  onClose: () => void
  currentRoom: ChatRoomWithOutPassword
  wsRemoveAdmin: (room: ChatRoomWithOutPassword, user: User) => void
}

export function AdminListDropDown({
  onClose,
  currentRoom,
  wsRemoveAdmin,
}: AdminListDropDownProps) {
  const [adminList, setAdminList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // 管理者一覧を取得する
    // TODO: カレントルームの情報にロールをすべて持たせるようにしたので、APIを叩く必要はない？
    const fetchAdminList = async () => {
      try {
        const res = await apiClient.get('/user/admins/' + currentRoom.id)
        setAdminList(res.data)
        console.log(res.data)
        setIsLoading(false)
      } catch (error: any) {
        if (error.response && error.response.data) {
          // レスポンスボディにエラーメッセージを設定してくれている場合
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
    fetchAdminList()
  }, [currentRoom.id])

  // 管理者の一覧をクリックすると、管理者の指定を解除するときのハンドラー
  const removeAdminHandler = (user: User) => {
    wsRemoveAdmin(currentRoom, user)
    onClose()
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={() => {
        onClose()
      }}
    >
      <div
        className="modal-content bg-white p-4 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-lg font-bold text-center border-b-2 border-gray-300">
          Admin List
        </div>

        {/* 管理者の名前と管理者解除のボタンを並べる */}
        {adminList.map((user) => (
          <li
            key={user.id}
            className="flex justify-between items-center border-gray-300 py-2"
          >
            <span>{user.username}</span>
            <button
              className="ml-2 px-4 py-2 bg-red-300 bg-opacity-60 text-white rounded hover:bg-red-500"
              onClick={() => {
                removeAdminHandler(user)
              }}
            >
              ✕
            </button>
          </li>
        ))}
      </div>
    </div>
  )
}
