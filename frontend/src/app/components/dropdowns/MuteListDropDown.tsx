import { ChatRoomWithOutPassword, User } from '@/app/types/types'
import { apiClient } from '@/lib/axios/apiClient'
import { useEffect, useState } from 'react'
import toast from 'react-hot-toast'

interface MuteListDropDownProps {
  onClose: () => void
  currentRoom: ChatRoomWithOutPassword
  wsUnMuteUser: (room: ChatRoomWithOutPassword, user: User) => void
}

export function MuteListDropDown({
  onClose,
  currentRoom,
  wsUnMuteUser,
}: MuteListDropDownProps) {
  const [muteList, setmuteList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)

  useEffect(() => {
    // Mutelistの一覧を取得する
    const fetchMuteList = async () => {
      try {
        const res = await apiClient.get('/user/mutes/' + currentRoom.id)
        setmuteList(res.data)
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
    fetchMuteList()
  }, [currentRoom.id])

  // MuteUserの一覧をクリックすると、MuteUserの指定を解除するときのハンドラー
  const unMuteHandler = (user: User) => {
    wsUnMuteUser(currentRoom, user)
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
        onClick={(e) => {
          e.stopPropagation()
        }}
      >
        <div className="text-lg font-bold text-center border-b-2 border-gray-300">
          Mute List
        </div>

        <div className="flex flex-col gap-2">
          {isLoading ? (
            <div>Loading...</div>
          ) : (
            <>
              {muteList.length === 0 ? (
                <div>no mute user</div>
              ) : (
                <>
                  {muteList.map((user) => (
                    <li
                      key={user.id}
                      className="flex justify-between items-center py-2 px-4 hover:bg-gray-200 cursor-pointer"
                    >
                      <span>{user.username}</span>
                      <button
                        className="ml-2 px-4 py-2 bg-red-300 bg-opacity-60 text-white rounded hover:bg-red-500"
                        onClick={() => {
                          unMuteHandler(user)
                        }}
                      >
                        ✕
                      </button>
                    </li>
                  ))}
                </>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  )
}
