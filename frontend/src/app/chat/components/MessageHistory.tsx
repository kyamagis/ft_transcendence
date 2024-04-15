import { MessageWithUser, User } from '../../types/types'
import { formatToJapaneseTime } from '../../../lib/dateFormat/ToJapaneseTime'
import { useEffect, useRef, useState } from 'react'
import { apiClient } from '../../../lib/axios/apiClient'
import toast from 'react-hot-toast'
import { useAuth } from '@/app/auth'
import { RelationType } from '@/app/types/types'
import InvitationCard from '@/app/pong/InvitationCard/InvitationCard'

interface propsType {
  onClickCallFC: (userId: User['id'], userName: User['username']) => void
  messageHistory: MessageWithUser[]
}

export function MessageHistory({ onClickCallFC, messageHistory }: propsType) {
  const [currentRoomHistory, setCurrentRoomHistory] = useState<
    MessageWithUser[]
  >([])
  const [isLoading, setIsLoading] = useState<boolean>(true)
  const { userData } = useAuth()
  const userId = useRef<number>(-1) // useRefで無くてもいい

  // @Get('block-list/:id') // ブロックしているユーザーの一覧を取得する
  useEffect(() => {
    const fetchBlockList = async () => {
      if (!userData?.id) return
      userId.current = userData?.id
      try {
        const res = await apiClient.get(
          `user-relation/relations/${userData.id}/${RelationType.BLOCKING} `
        )
        setIsLoading(false)
        // ブロックリストはUser[]型で返ってくるので、これを使って、メッセージ履歴からブロックしているユーザーのメッセージを除外する
        const blockList = res.data
        console.log('ブロックリスト', blockList)
        // ブロックリストに含まれているユーザーのメッセージを除外する
        const filteredMessageHistory = messageHistory.filter(
          (message) =>
            !blockList.some((user: User) => user.id === message.user.id)
        )

        // ブロックリストを除外したメッセージ履歴をセットする
        setCurrentRoomHistory(filteredMessageHistory)
      } catch (error: any) {
        setIsLoading(false)
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
  }, [userData?.id, messageHistory])

  if (isLoading) {
    return <div>loading...</div>
  }

  return (
    <div className="overflow-y-auto pb-16">
      {currentRoomHistory.map((message, index) => (
        <div key={index} className="p-2 border-b border-gray-300 flex flex-col">
          <div className="flex">
            <span
              className="pr-5 cursor-pointer font-bold hover:underline hover:text-gray-600 text-gray-800"
              onClick={() =>
                onClickCallFC(message.user.id, message.user.username)
              }
            >
              {message.user.username}
            </span>
            <span>
              {message.timestamp.toString().slice(0, 10) +
                ' ' +
                formatToJapaneseTime(message.timestamp.toString())}
            </span>
          </div>
          {message.gameParametersJson && userId.current != message.user.id ? (
            <div>
              <InvitationCard
                setCurrentRoomHistory={setCurrentRoomHistory}
                messageId={message.id}
                myUserID={userId.current}
                opponentUserID={message.user.id}
                gameParametersJson={message.gameParametersJson}
              />
            </div>
          ) : (
            <div>{message.content}</div>
          )}
        </div>
      ))}
    </div>
  )
}
