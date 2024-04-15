import React, { useEffect, useState } from 'react'
import { useUser, UserData } from '@/app/hooks/useUser'
import Image from 'next/image' // next/imageをインポート
import { apiClient } from '@/lib/axios/apiClient'
import { useAuth } from '@/app/auth'
import toast from 'react-hot-toast'
import { ChatRoomWithOutPassword, RelationType } from '@/app/types/types'

import { useRef } from 'react'
import { GameParameterRefArray, PongSettingData } from '@/app/pong/types'
import { GAME_PARAMETER_MAX_LEVEL } from '@/app/pong/constant'
import calcMedian from '@/app/pong/funcutils/calcMedian'
import { ScreenManagement } from '@/app/pong/enums'
import InvitationalMatchModals from './InvitationalMatchModals'
import { useMatchRecords } from '@/app/hooks/useMatchRecord'

type Status = 'CHAT' | 'PONG' | 'OFFLINE' | 'IDLE'

type ProfileModalProps = {
  onClose: () => void
  userID: number
  dmHandler?: () => void
  inviteHandler?: (dmChatRoomInfo: ChatRoomWithOutPassword) => void
}

export function ProfileModal({
  onClose,
  userID,
  dmHandler,
  inviteHandler,
}: ProfileModalProps) {
  const { userData: targetUserData, isLoading, error } = useUser(userID) // useUserフックの利用
  const { userData: myData, setAuthStatus, authStatus } = useAuth() // useAuthフックの利用
  const { matchRecords } = useMatchRecords(userID)
  const [isFriend, setIsFriend] = useState<boolean>(false) // フレンドかどうかの状態
  const [friendStatus, setFriendStatus] = useState<Status | null>(null) // フレンドのステータス
  const [screenManagementState, setScreenManagementState] =
    useState<ScreenManagement>(ScreenManagement.PongHome) // pongの画面管理
  const errorMessageRef = useRef<string>('')

  const gameParameterRefArray: GameParameterRefArray = [
    {
      text: 'BALL SPEED',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
    {
      text: 'PADDLE SPEED',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
    {
      text: 'GRAVITY',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
  ]

  useEffect(() => {
    if (!targetUserData) return
    if (!myData) return
    console.log('targetUserData: ', targetUserData)
    console.log('myData: ', myData)
    if (targetUserData.id === myData.id) return

    // フレンドかどうかfetchする
    const fetchIsFriend = async () => {
      try {
        const res = await apiClient.get(
          `/user-relation/is-friend/${myData.id}/${userID}`
        )
        setIsFriend(res.data)
        if (res.data) {
          // フレンドのステータスをfetchする
          const res = await apiClient.get('/user-status/' + targetUserData.id)
          console.log('friendStatus: ', res.data)
          setFriendStatus(res.data)
        }
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
    fetchIsFriend()
  }, [targetUserData, myData, userID])

  // 友達登録ボタンを押した時のハンドラー
  const addFriendHandler = async () => {
    try {
      const userRelationDto = {
        userId: myData?.id,
        relatedUserId: userID,
        relationType: RelationType.FRIEND,
      }
      await apiClient.post('user-relation/manage-relation/ADD', userRelationDto)
      setIsFriend(true)
      // @Get('friend-status/:myId/:friendId')
      const res = await apiClient.get('/user-status/' + userID)
      toast.success('Added Friend')
      setFriendStatus(res.data)
      setIsBlocked(false)
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

  const [isBlocked, setIsBlocked] = useState<boolean>(false) // ブロックかどうかの状態

  // Invite To Pong ボタンを押したときのハンドラー
  const inviteToPongHandler = () => {
    setScreenManagementState(ScreenManagement.LetterOfInvitation)
  }

  // ブロックボタンを押した時のハンドラー
  const blockHandler = async () => {
    try {
      const userRelationDto = {
        userId: myData?.id,
        relatedUserId: userID,
        relationType: 'BLOCKING',
      }
      await apiClient.post('user-relation/manage-relation/ADD', userRelationDto)
      toast.success('Blocked')
      setIsFriend(false)
      setIsBlocked(true)
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

  if (isLoading || authStatus === 'VALIDATING') {
    return <div>Loading...</div> // データ読み込み中はローディングテキストを表示
  }

  if (error || authStatus === 'UNAUTHORIZED') {
    return <div>Error loading user data</div> // エラーが発生したらエラーテキストを表示
  }

  if (!myData || !targetUserData) {
    return null // ユーザーデータがない場合は何も表示しない
  }

  // 招待戦関連のモーダル
  if (screenManagementState !== ScreenManagement.PongHome) {
    return (
      <InvitationalMatchModals
        onClose={onClose}
        inviteHandler={inviteHandler}
        targetUserData={targetUserData}
        myData={myData}
        screenManagementState={screenManagementState}
        setScreenManagementState={setScreenManagementState}
        errorMessageRef={errorMessageRef}
        gameParameterRefArray={gameParameterRefArray}
      />
    )
  }

  return (
    <div
      className="fixed inset-0 flex items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={onClose}
    >
      <div
        className="modal-content bg-white bg-opacity-90 p-4 rounded shadow-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="text-gray-800 text-xl mb-2 font-bold border-b-2 border-gray-300">
          User Profile
        </div>
        {/* 友達の場合はログインステータスを表示 */}
        {/* avatarがある場合はImageコンポーネントを使用して表示し、ない場合はデフォルトアバターを表示 */}
        {targetUserData.avatar ? (
          <Image
            src={`data:image/jpeg;base64,${Buffer.from(
              targetUserData.avatar
            ).toString('base64')}`}
            alt="User Avatar"
            width={100}
            height={100}
            className="mb-4"
          />
        ) : (
          <Image
            src="/defaultAvatar.png"
            alt="Default Avatar"
            width={100}
            height={100}
            className="mb-4"
          />
        )}
        <div className="text-gray-700 mb-2">ID: {targetUserData.id}</div>
        <div className="text-gray-700 mb-2">
          Name: {targetUserData.username}
        </div>
        {isFriend && <div className="text-gray-700 mb-4">{friendStatus}</div>}
        <div className="text-gray-700 mb-2">
          Ladder Rank: {matchRecords?.ladderRank}
        </div>
        {matchRecords?.matchrecords &&
          matchRecords?.matchrecords.length > 0 && (
            <div className="text-gray-700 mb-4">
              <div className="mb-2">Match Records</div>{' '}
              <table className="min-w-full bg-white">
                <thead>
                  <tr>
                    <th className="py-2 px-4 border-b">Score</th>
                    <th className="py-2 px-4 border-b">Match Type</th>
                    <th className="py-2 px-4 border-b">Date</th>
                  </tr>
                </thead>
                <tbody>
                  {matchRecords.matchrecords.map((record) => (
                    <tr key={record.recordid}>
                      <td className="py-2 px-4 border-b">
                        {record.myscore} - {record.opponentscore}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {record.matchtype === 'LadderMatch'
                          ? 'Ladder'
                          : 'Private'}
                      </td>
                      <td className="py-2 px-4 border-b">
                        {new Date(record.playedat).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        {/* ボタン群を立てに並べて表示する 間を少し開ける*/}
        <div className="flex flex-col space-y-2">
          {/* 自分でなければDM機能を提供するボタンを表示 */}
          {dmHandler && myData.id !== targetUserData.id && (
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={() => {
                onClose()
                dmHandler()
              }}
            >
              DM
            </button>
          )}

          {/* 友達でない場合は友達登録ボタンを表示する */}
          {!isFriend && myData.id !== targetUserData.id && (
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={addFriendHandler}
            >
              Add Friend
            </button>
          )}
          {/* pongに招待する */}
          {!isBlocked && myData.id !== targetUserData.id && (
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={inviteToPongHandler}
            >
              Invite To Pong
            </button>
          )}
          {/* ブロックボタンを表示する */}
          {!isBlocked && myData.id !== targetUserData.id && (
            <button
              className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
              onClick={blockHandler}
            >
              Block
            </button>
          )}
          {/* 閉じるボタン */}
          <button
            className="bg-gray-700 text-white py-2 px-4 rounded hover:bg-gray-600"
            onClick={onClose}
          >
            Close
          </button>
        </div>
      </div>
    </div>
  )
}
