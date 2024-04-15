// 自身のuserIdを受け取り、自身のフレンドの一覧をバックエンドサーバーに問い合わせる
// フレンドの一覧をリストとして表示し、クリックするとプロフィールモーダルが開くようにする
import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios/apiClient'
import { ProfileModal } from '../Modals/ProfileModal'
import toast from 'react-hot-toast'
import { RelationType } from '@/app/types/types'

type User = {
  id: number
  username: string
}

type FriendListDropDownProps = {
  onClose: () => void
  userID: number
}

export function FriendListDropDown({
  onClose,
  userID,
}: FriendListDropDownProps) {
  const [friendList, setFriendList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profileUserID, setProfileUserID] = useState<number | null>(null)

  useEffect(() => {
    // フレンド一覧を取得する
    const fetchFriendList = async () => {
      // @Get('relations/:id/:relationType')
      try {
        const res = await apiClient.get(
          `/user-relation/relations/${userID}/${RelationType.FRIEND}`
        )
        setFriendList(res.data)
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
    fetchFriendList()
  }, [userID])

  // 友達の関係を解除するときのボタンハンドラー @Get('remove-friend/:myId/:friendId')
  const handleUnfriend = async (friendID: number) => {
    try {
      const userRelationDto = {
        userId: userID,
        relatedUserId: friendID,
        relationType: RelationType.FRIEND,
      }

      const res = await apiClient.post(
        '/user-relation/manage-relation/REMOVE',
        userRelationDto
      )
      // フレンド一覧を再取得する
      const res2 = await apiClient.get(
        `/user-relation/relations/${userID}/${RelationType.FRIEND}`
      )
      setFriendList(res2.data)
      console.log(res.data)
      toast.success('Remove from friend list')
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

  // ロード中の表示
  if (isLoading) {
    return <div>Loading...</div>
  }

  return (
    <div>
      {profileUserID ? (
        <ProfileModal
          onClose={() => setProfileUserID(null)}
          userID={profileUserID}
        />
      ) : (
        /* Friend List クリックすると */
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-bold text-center border-b-2 border-gray-300">
              Friend List
            </div>
            {/* 友達の名前と友達リストからの削除ボタンを並べる */}
            {friendList.length === 0 && (
              <div className="text-center text-gray-500">No friends</div>
            )}

            {friendList.map((friend) => (
              <li
                key={friend.id}
                className="flex justify-between items-center hover:bg-gray-100 p-2"
              >
                <button
                  className="flex-grow flex items-center justify-between opacity-90 hover:opacity-100 focus:outline-none"
                  onClick={() => {
                    setProfileUserID(friend.id)
                  }}
                >
                  <span>{friend.username}</span>
                  <span
                    className="ml-2 px-4 py-2 bg-red-300 bg-opacity-60 text-white rounded hover:bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation() // この行を追加して親ボタンのクリックイベントを停止
                      handleUnfriend(friend.id)
                    }}
                  >
                    −
                  </span>
                </button>
              </li>
            ))}

            {/* Close */}

            <button
              className="bg-gray-700 text-white mt-4 py-2 px-4 rounded hover:bg-gray-600"
              onClick={onClose}
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  )
}
