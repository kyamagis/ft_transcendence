import { UserSearchModal } from '@/app/components/Modals/UserSearchModal'
import {
  ChatRoomWithOutPassword,
  RoomType,
  User,
  UserRole,
} from '../../types/types'
import { useState } from 'react'
import toast from 'react-hot-toast'
import { OwnerMenuModal } from './OwnerMenuModal'
import { AdminMenuModal } from './AdminMenuModal'
import { useAuth } from '@/app/auth'

interface propsType {
  currentRoom: ChatRoomWithOutPassword | null
  wsLeaveRoom: (room: ChatRoomWithOutPassword | null) => void
  wsDeleteRole: (room: ChatRoomWithOutPassword) => void
  wsInviteUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsTransferOwner: (room: ChatRoomWithOutPassword, user: User) => void
  wsDeleteRoom: (room: ChatRoomWithOutPassword) => void
  wsSetAdmin: (room: ChatRoomWithOutPassword, user: User) => void
  wsRemoveAdmin: (room: ChatRoomWithOutPassword, user: User) => void
  wsKickUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsBanUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsMuteUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsUnBanUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsUnMuteUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsSetPassword: (room: ChatRoomWithOutPassword, password: string) => void
}

export function CurrentRoom({
  currentRoom,
  wsLeaveRoom,
  wsDeleteRole,
  wsInviteUser,
  wsTransferOwner,
  wsDeleteRoom,
  wsSetAdmin,
  wsRemoveAdmin,
  wsKickUser,
  wsBanUser,
  wsMuteUser,
  wsUnBanUser,
  wsUnMuteUser,
  wsSetPassword,
}: propsType) {
  // inviteボタンを押すと、ユーザー名で検索できるコンポーネントを表示する
  const [showSearchUserModal, setShowSearchUserModal] = useState(false)
  const inviteUserClickHandler = (user: User) => {
    console.log('invite: ', user)
    // バックエンドサーバーに、引数で受け取ったユーザーを招待するように命令する
    if (currentRoom) {
      wsInviteUser(currentRoom, user)
    }
  }

  const [showOwerMenuModal, setShowOwerMenuModal] = useState(false)
  const openOwerMenuModal = () => {
    setShowOwerMenuModal(true)
  }
  const closeOwerMenuModal = () => {
    setShowOwerMenuModal(false)
  }

  const [showAdminMenuModal, setShowAdminMenuModal] = useState(false)
  const openAdminMenuModal = () => {
    console.log(currentRoom?.userRoles)
    setShowAdminMenuModal(true)
  }
  const closeAdminMenuModal = () => {
    setShowAdminMenuModal(false)
  }

  const { userData, authStatus, setAuthStatus } = useAuth()

  return (
    <div className="flex justify-between items-center p-2 border-b border-gray-300">
      <span className="text-lg font-bold">
        {currentRoom
          ? currentRoom.roomName + '  [' + currentRoom.roomType + ']'
          : 'No Room Selected'}
      </span>

      <div className="flex justify-end space-x-4">
        {currentRoom?.roomType !== RoomType.DM &&
          currentRoom?.userRoles.find(
            (role) =>
              role.userRole === UserRole.OWNER && role.userId === userData?.id
          ) && (
            <button
              className="px-4 py-2 bg-gray-200 bg-opacity-30 text-white rounded hover:bg-green-500"
              onClick={openOwerMenuModal}
            >
              Owner Menu
            </button>
          )}
        {currentRoom?.roomType !== RoomType.DM &&
          currentRoom?.userRoles.find(
            (role) =>
              role.userRole === UserRole.ADMIN && role.userId === userData?.id
          ) && (
            <button
              className="px-4 py-2 bg-gray-200 bg-opacity-30 text-white rounded hover:bg-green-500"
              onClick={openAdminMenuModal}
            >
              Admin Menu
            </button>
          )}

        {/* プライベートチャンネルの場合は招待ボタン */}
        {currentRoom && currentRoom.roomType === 'PRIVATE' && (
          <span
            className="ml-2 px-4 py-2 bg-gray-200 bg-opacity-30 text-white rounded hover:bg-green-500"
            onClick={(e) => {
              e.stopPropagation() // この行を追加して親ボタンのクリックイベントを停止
              setShowSearchUserModal(true)
            }}
          >
            Invite
          </span>
        )}
        {/* 退出ボタン */}
        <span
          className="ml-2 px-4 py-2 bg-red-200 bg-opacity-30 text-white rounded hover:bg-red-500"
          onClick={(e) => {
            e.stopPropagation() // この行を追加して親ボタンのクリックイベントを停止

            // 自分がオーナーの場合は、退室できないroom.userRolesの配列には自分の情報しかない
            if (
              currentRoom?.userRoles.find(
                (userRole) =>
                  userRole.userRole === 'OWNER' &&
                  userRole.userId === userData?.id
              )
            ) {
              toast.error('You are owner')
              return
            }
            if (currentRoom) {
              wsDeleteRole(currentRoom)
            }
            wsLeaveRoom(currentRoom)
          }}
        >
          Leave
        </span>
      </div>
      {/* ユーザー検索モーダル */}
      {showSearchUserModal && currentRoom?.roomType !== RoomType.DM && (
        <UserSearchModal
          onClose={() => setShowSearchUserModal(false)}
          onClickHandler={inviteUserClickHandler}
          guideMessage="Click on the name in the search results to invite PrivateRoom."
        />
      )}

      {/* オーナーメニューモーダル */}
      {showOwerMenuModal &&
        currentRoom &&
        currentRoom?.roomType !== RoomType.DM && (
          <OwnerMenuModal
            currentRoom={currentRoom}
            onClose={() => closeOwerMenuModal()}
            wsTransferOwner={wsTransferOwner}
            wsDeleteRoom={wsDeleteRoom}
            wsSetAdmin={wsSetAdmin}
            wsRemoveAdmin={wsRemoveAdmin}
            wsSetPassword={wsSetPassword}
          />
        )}
      {/* 管理者メニューモーダル */}
      {showAdminMenuModal &&
        currentRoom &&
        currentRoom?.roomType !== RoomType.DM && (
          <AdminMenuModal
            onClose={() => closeAdminMenuModal()}
            currentRoom={currentRoom}
            wsKickUser={wsKickUser}
            wsBanUser={wsBanUser}
            wsMuteUser={wsMuteUser}
            wsUnBanUser={wsUnBanUser}
            wsUnMuteUser={wsUnMuteUser}
          />
        )}
    </div>
  )
}
