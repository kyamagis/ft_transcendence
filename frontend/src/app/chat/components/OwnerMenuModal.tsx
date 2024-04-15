// オーナーは、地位の譲渡と管理者の指定を行うことができる
// 管理者はチャット内のメンバーから指定する
// 管理者は複数存在することができる

import React, { useState } from 'react'
import { UserSearchModal } from '@/app/components/Modals/UserSearchModal'
import { ChatRoomWithOutPassword, RoomType, User } from '../../types/types'
import { AdminListDropDown } from '@/app/components/dropdowns/AdminListDropDown'
import LinksDropDown from '@/app/components/dropdowns/linksDropdown'
import { SetPasswordModal } from '@/app/components/dropdowns/SetPasswordModal'

interface OwnerMenuModalProps {
  onClose: () => void
  currentRoom: ChatRoomWithOutPassword
  wsTransferOwner: (room: ChatRoomWithOutPassword, user: User) => void
  wsDeleteRoom: (room: ChatRoomWithOutPassword) => void
  wsSetAdmin: (room: ChatRoomWithOutPassword, user: User) => void
  wsRemoveAdmin: (room: ChatRoomWithOutPassword, user: User) => void
  wsSetPassword: (room: ChatRoomWithOutPassword, password: string) => void
}

export function OwnerMenuModal({
  onClose,
  currentRoom,
  wsTransferOwner,
  wsDeleteRoom,
  wsSetAdmin,
  wsRemoveAdmin,
  wsSetPassword,
}: OwnerMenuModalProps) {
  console.log('OwnerMenuModal')

  // 地位の譲渡が押されたときの状態管理
  const [showTransferOwnerModal, setShowTransferOwnerModal] = useState(false)
  const openTransferOwnerModal = () => {
    setShowTransferOwnerModal(true)
  }
  const closeTransferOwnerModal = () => {
    setShowTransferOwnerModal(false)
  }

  // 地位の譲渡の際のハンドラー
  const transferOwnerHandler = (user: User) => {
    wsTransferOwner(currentRoom, user)
  }

  // passwordの設定が押されたときの状態管理
  const [showSetPasswordModal, setShowSetPasswordModal] = useState(false)
  const openSetPasswordModal = () => {
    setShowSetPasswordModal(true)
  }
  const closeSetPasswordModal = () => {
    setShowSetPasswordModal(false)
  }

  // passwordの設定の際のハンドラー
  const setPasswordHandler = (newPassword: string) => {
    wsSetPassword(currentRoom, newPassword)
  }

  // 管理者指定が押されたときの状態管理
  const [showSetAdminModal, setShowSetAdminModal] = useState(false)
  const openSetAdminModal = () => {
    setShowSetAdminModal(true)
  }
  const closeSetAdminModal = () => {
    setShowSetAdminModal(false)
  }

  // 管理者指定の際のハンドラー
  const setAdminHandler = (user: User) => {
    wsSetAdmin(currentRoom, user)
  }

  // 管理者一覧を表示するかどうかを管理する状態
  const [showAdminList, setShowAdminList] = useState(false)
  const [adminList, setAdminList] = useState<User[]>([])
  const openAdminList = () => {
    // 管理者の一覧を取得する
    const adminList = currentRoom.userRoles.filter((userRole) => {
      if (userRole.userRole === 'ADMIN') {
        return true
      }
      return false
    })

    setShowAdminList(true)
  }
  const closeAdminList = () => {
    setShowAdminList(false)
  }

  return (
    <div
      className="flex fixed inset-0 items-center justify-center bg-gray-800 bg-opacity-50 z-50"
      onClick={() => {
        onClose()
      }}
    >
      <div
        className="flex flex-col bg-white p-4 shadow-lg rounded-lg"
        onClick={(e) => e.stopPropagation()}
      >
        <span className="text-lg font-bold text-center border-b-2 border-gray-300">
          Owner Menu
        </span>

        <button
          onClick={openTransferOwnerModal}
          className="px-4 py-2  hover:bg-gray-300"
        >
          Transfer ownership
        </button>
        <button
          onClick={openSetAdminModal}
          className="px-4 py-2  hover:bg-gray-300"
        >
          Assignment of Administrator
        </button>
        <button
          onClick={openAdminList}
          className="px-4 py-2  hover:bg-gray-300"
        >
          Admin List
        </button>
        {/* DMとプライベートチャンネルはパスワードを付ける意味が無い */}
        {currentRoom.roomType !== RoomType.PRIVATE &&
          currentRoom.roomType !== RoomType.DM && (
            <button
              onClick={openSetPasswordModal}
              className="px-4 py-2  hover:bg-gray-300"
            >
              Set Password
            </button>
          )}
        <button
          onClick={() => {
            wsDeleteRoom(currentRoom)
          }}
          className="px-4 py-2  hover:bg-gray-300"
        >
          Delete Room
        </button>
      </div>

      {showSetPasswordModal && (
        <SetPasswordModal
          setPasswordHandler={setPasswordHandler}
          onClose={closeSetPasswordModal}
          currentRoom={currentRoom}
        />
      )}

      {showTransferOwnerModal && (
        <UserSearchModal
          onClickHandler={transferOwnerHandler}
          onClose={closeTransferOwnerModal}
          guideMessage="Click on the name in the search results to transfer ownership."
        />
      )}

      {showSetAdminModal && (
        <UserSearchModal
          onClickHandler={setAdminHandler}
          onClose={closeSetAdminModal}
          guideMessage="Click on the name in the search results to set the administrator."
        />
      )}

      {showAdminList && (
        // ユーザーロールがADMINのユーザーの一覧を表示する
        <AdminListDropDown
          onClose={closeAdminList}
          currentRoom={currentRoom}
          wsRemoveAdmin={wsRemoveAdmin}
        />
      )}
    </div>
  )
}
