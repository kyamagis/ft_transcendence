// 自身のuserIdを受け取り、自身のブロックしている相手の一覧をバックエンドサーバーに問い合わせる
// その一覧をリストとして表示し、クリックするとプロフィールモーダルが開くようにする

import { useEffect, useState } from 'react'
import { apiClient } from '@/lib/axios/apiClient'
import { ProfileModal } from '../Modals/ProfileModal'
import toast from 'react-hot-toast'
import { RelationType } from '@/app/types/types'

type User = {
  id: number
  username: string
}

type BlockListDropDownProps = {
  onClose: () => void
  userID: number
}

export function BlockListDropDown({ onClose, userID }: BlockListDropDownProps) {
  const [blockList, setBlockList] = useState<User[]>([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const [profileUserID, setProfileUserID] = useState<number | null>(null)

  useEffect(() => {
    // ブロック一覧を取得する
    const fetchBlockList = async () => {
      try {
        // @Get('relations/:id/:relationType')
        const res = await apiClient.get(
          `/user-relation/relations/${userID}/${RelationType.BLOCKING}`
        )
        setBlockList(res.data)
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
    fetchBlockList()
  }, [userID])

  const handleUnblock = async (blockID: number) => {
    try {
      const userRelationDto = {
        userId: userID,
        relatedUserId: blockID,
        relationType: RelationType.BLOCKING,
      }
      //  @Post('manage-relation/:action') + Body() userRelationDto: UserRelationDto
      const res = await apiClient.post(
        '/user-relation/manage-relation/REMOVE',
        userRelationDto
      )
      // ブロック一覧を再取得する
      const res2 = await apiClient.get(
        `/user-relation/relations/${userID}/${RelationType.BLOCKING}`
      )
      setBlockList(res2.data)
      console.log(res.data)
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

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <div>
      {profileUserID ? (
        <ProfileModal
          onClose={() => setProfileUserID(null)}
          userID={profileUserID}
        />
      ) : (
        <div
          className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
          onClick={onClose}
        >
          <div
            className="modal-content bg-white p-4 rounded shadow-lg"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-lg font-bold text-center border-b-2 border-gray-300">
              Block List
            </div>
            {/* 友達の名前と友達リストからの削除ボタンを並べる */}

            {blockList.length === 0 && (
              <div className="text-center text-gray-500 py-4">
                You have no blocked users.
              </div>
            )}

            {blockList.map((blockUser) => (
              <li
                key={blockUser.id}
                className="flex justify-between items-center hover:bg-gray-100 p-2"
              >
                <button
                  className="flex-grow flex items-center justify-between opacity-90 hover:opacity-100 focus:outline-none"
                  onClick={() => {
                    setProfileUserID(blockUser.id)
                  }}
                >
                  <span>{blockUser.username}</span>
                  <span
                    className="ml-2 px-4 py-2 bg-red-300 bg-opacity-60 text-white rounded hover:bg-red-500"
                    onClick={(e) => {
                      e.stopPropagation() // この行を追加して親ボタンのクリックイベントを停止
                      handleUnblock(blockUser.id)
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
