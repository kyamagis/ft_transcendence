'use client'

import { Socket } from 'socket.io-client'
import React, { useEffect, useState } from 'react'
import { ChatRoomWithOutPassword, RoomType, User } from '../types/types'
import { AuthForm, useAuth } from '@/app/auth'
import { ProfileModal } from '../components/Modals/ProfileModal'
import { CreateNewRoomButton } from './components/CreateNewRoomButton'
import { ShowRoomsButton } from './components/ShowRoomsButton'
import { MessageHistory } from './components/MessageHistory'
import { SendMessaInputArea } from './components/SendMessageInputArea'
import { RoomCreateModal } from './components/RoomCreateModal'
import { RoomList } from './components/RoomList'
import { ProtectedRoomPasswordInputModal } from './components/ProtectedRoomPasswordInputModal'
import { CurrentRoom } from './components/CurrentRoom'
import { useRoomList } from './hooks/useRoomList'
import { useProtectedRoom } from './hooks/useProtectedRoom'
import { useRoomCreate } from './hooks/useRoomCreate'
import { useProfileModal } from './hooks/useProfileModal'
import { useMessageHistory } from './hooks/useMessageHistory'
import { useWebSocket } from './hooks/useWebSocket'
import { useChatActions } from './hooks/useChatActions'
import { registerStatus } from '@/lib/LoginStatus/registerLoginStatus'
import toast from 'react-hot-toast'
import { UserSearchModal } from '../components/Modals/UserSearchModal'

const ChatPage: React.FC = () => {
  /* 新規ルーム関連 */
  const {
    showModalRoomCreate,
    openRoomCreateModal,
    closeRoomCreateModal,
    newRoomName,
    setNewRoomName,
    newRoomType,
    setNewRoomType,
    newRoomPassword,
    setNewRoomPassword,
  } = useRoomCreate()

  /* ルーム一覧関連 */
  const {
    currentRoom,
    setCurrentRoom,
    roomList,
    setRoomList,
    showDM,
    toggleShowDM,
    showPublic,
    toggleShowPublic,
    showPrivate,
    toggleShowPrivate,
    showProtected,
    toggleShowProtected,
  } = useRoomList()

  /* パスワード付きルームのパスワード入力関連 */
  const {
    showModalProtectedRomm,
    openPasswordInputModal,
    closePasswordInputModal,
    inputRoomPassword,
    setInputRoomPassword,
  } = useProtectedRoom()

  /* プロフィールモーダル関連 */
  const { showProfileModalUser, openProfileModal, closeProfileModal } =
    useProfileModal()

  /* メッセージ履歴関連 */
  const { currentRoomHistory, setCurrentRoomHistory } = useMessageHistory()

  /* ユーザー情報取得 */
  const { userData, setAuthStatus } = useAuth()

  useEffect(() => {
    if (!userData?.id) return
    registerStatus(userData?.id, 'CHAT')
  }, [userData?.id, setAuthStatus])

  const [sessionError, setSessionError] = useState(false)
  /* WebSocket接続確立とハンドラーの登録 */
  const socket: Socket | null = useWebSocket({
    userId: userData?.id,
    setRoomList: setRoomList,
    setCurrentRoomHistory: setCurrentRoomHistory,
    setCurrentRoom: setCurrentRoom,
    openPasswordInputModal: openPasswordInputModal,
    setSessionError: setSessionError,
  })

  const {
    sendMessage,
    setSendMessage,
    WsSendMessage,
    wsCreateRoom,
    wsDeleteRole,
    wsDeleteRoom,
    wsJoinRoom,
    wsLeaveRoom,
    wsInviteUser,
    wsTransferOwner,
    wsSetAdmin,
    wsRemoveAdmin,
    wsKickUser,
    wsBanUser,
    wsMuteUser,
    wsUnBanUser,
    wsUnMuteUser,
    wsSetPassword,
    wsGetRoomList,
    wsGetMessageHistory,
  } = useChatActions({
    socket,
    userData,
    currentRoom,
    setCurrentRoom,
    roomList,
    setCurrentRoomHistory,
    closeRoomCreateModal,
    newRoomName,
    setNewRoomName,
    newRoomType,
    setNewRoomType,
    newRoomPassword,
    setNewRoomPassword,
  })

  const dmHndler = () => {
    if (showProfileModalUser === null) return false
    const dmRoom = roomList.find((room) => {
      if (room.roomType !== RoomType.DM) return false
      const user1 = room.userRoles[0].userId
      const user2 = room.userRoles[1].userId
      if (user1 === showProfileModalUser.id || user2 === userData?.id)
        return true
      if (user1 === userData?.id || user2 === showProfileModalUser.id)
        return false
    })
    if (dmRoom) {
      wsJoinRoom(dmRoom)
    } else {
      const newroomname =
        showProfileModalUser.id.toString() + '&' + userData?.id.toString()
      wsCreateRoom(newroomname, RoomType.DM)
    }
  }

  const inviteHandler = (dmChatRoomInfo: ChatRoomWithOutPassword) => {
    setRoomList((prev) => {
      const roomIndex = prev.findIndex(
        (prevRoom) => prevRoom.id === dmChatRoomInfo.id
      )
      if (roomIndex === -1) {
        // 存在しない場合は、新規作成
        return [...prev, dmChatRoomInfo]
      } else {
        // 存在する場合は、既存のルームを更新
        const newRoomList = [...prev]
        newRoomList[roomIndex] = dmChatRoomInfo
        return newRoomList
      }
    })

    setCurrentRoom((prev) => {
      if (prev?.id === dmChatRoomInfo.id) {
        return dmChatRoomInfo
      } else {
        return prev
      }
    })
  }

  // ユーザー検索窓を表示するボタンの状態
  const [showUserSearchModal, setShowUserSearchModal] = useState(false)
  const userSearchHandler = (user: User) => {
    openProfileModal(user.id, user.username)
  }

  if (sessionError) return <AuthForm />

  return (
    <div className="flex h-full">
      {/* Rooms Section */}
      <div className="w-1/6 h-full overflow-y-auto bg-white bg-opacity-30 border-r">
        <div className="flex flex-col text-gray-700">
          <button
            onClick={() => setShowUserSearchModal(true)}
            className="py-2 px-4 my-2 mx-4 bg-yellow-200 hover:bg-yellow-300 bg-opacity-50 rounded focus:outline-none"
          >
            Seach User
          </button>
          <CreateNewRoomButton onClick={openRoomCreateModal} />

          <ShowRoomsButton
            type="DM"
            onClick={() => {
              wsGetRoomList()
              toggleShowDM()
            }}
          />
          {showDM && (
            <RoomList
              roomList={roomList}
              showRoomType={RoomType.DM}
              currentRoom={currentRoom}
              wsLeaveRoom={wsLeaveRoom}
              wsJoinRoom={wsJoinRoom}
            />
          )}

          <ShowRoomsButton type="Public" onClick={toggleShowPublic} />
          {showPublic && (
            <RoomList
              roomList={roomList}
              showRoomType={RoomType.PUBLIC}
              currentRoom={currentRoom}
              wsLeaveRoom={wsLeaveRoom}
              wsJoinRoom={wsJoinRoom}
            />
          )}

          <ShowRoomsButton type="Private" onClick={toggleShowPrivate} />
          {showPrivate && (
            <RoomList
              roomList={roomList}
              showRoomType={RoomType.PRIVATE}
              currentRoom={currentRoom}
              wsLeaveRoom={wsLeaveRoom}
              wsJoinRoom={wsJoinRoom}
            />
          )}

          <ShowRoomsButton type="Protected" onClick={toggleShowProtected} />
          {showProtected && (
            <RoomList
              roomList={roomList}
              showRoomType={RoomType.PASSWORD_PROTECTED}
              currentRoom={currentRoom}
              wsLeaveRoom={wsLeaveRoom}
              wsJoinRoom={wsJoinRoom}
            />
          )}
        </div>
      </div>

      {/* Message Section */}
      <div className="flex flex-col w-5/6 h-full relative">
        <CurrentRoom
          currentRoom={currentRoom}
          wsLeaveRoom={wsLeaveRoom}
          wsDeleteRole={wsDeleteRole}
          wsInviteUser={wsInviteUser}
          wsTransferOwner={wsTransferOwner}
          wsDeleteRoom={wsDeleteRoom}
          wsSetAdmin={wsSetAdmin}
          wsRemoveAdmin={wsRemoveAdmin}
          wsKickUser={wsKickUser}
          wsBanUser={wsBanUser}
          wsMuteUser={wsMuteUser}
          wsUnBanUser={wsUnBanUser}
          wsUnMuteUser={wsUnMuteUser}
          wsSetPassword={wsSetPassword}
        />

        {/* MessageWithUser History Section */}
        <MessageHistory
          onClickCallFC={openProfileModal}
          messageHistory={currentRoomHistory}
        />
        {/* MessageWithUser Input Section */}
        {currentRoom && userData && (
          <SendMessaInputArea
            onClickCallFC={WsSendMessage}
            onChangeCallFC={setSendMessage}
            value={sendMessage}
            currentRoom={currentRoom}
            id={userData?.id}
          />
        )}
      </div>

      {/* Modals */}
      {showProfileModalUser && (
        <ProfileModal
          onClose={closeProfileModal}
          userID={showProfileModalUser.id}
          dmHandler={dmHndler}
          inviteHandler={inviteHandler}
        />
      )}

      {showModalProtectedRomm && (
        <ProtectedRoomPasswordInputModal
          setRoomPassword={setInputRoomPassword}
          closeRoomPasswordInputModal={closePasswordInputModal}
          currentRoom={currentRoom}
          roomPassword={inputRoomPassword}
          socket={socket}
        />
      )}

      {showModalRoomCreate && (
        <RoomCreateModal
          setNewRoomType={setNewRoomType}
          setNewRoomName={setNewRoomName}
          setNewRoomPassword={setNewRoomPassword}
          wsCreateRoom={wsCreateRoom}
          closeRoomCreateModal={closeRoomCreateModal}
          newRoomType={newRoomType}
          newRoomName={newRoomName}
        />
      )}

      {showUserSearchModal && (
        <UserSearchModal
          onClickHandler={userSearchHandler}
          onClose={() => setShowUserSearchModal(false)}
          guideMessage="Click on the name in the search results show the profile."
        />
      )}
    </div>
  )
}

export default ChatPage
