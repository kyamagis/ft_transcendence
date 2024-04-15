/*
管理者は、オーナー以外に対し、以下の機能を持つ
キック: チャンネルの管理者は、他のユーザーをチャンネルから追い出す（キックする）権限を持っています。
バン (Ban): チャンネルの管理者は、他のユーザーをチャンネルから永久に追い出す（バンする）権限を持っています。
ミュート (Mute): チャンネルの管理者は、他のユーザーを一定時間、チャンネルで発言できないようにする（ミュートする）権限を持っています。 

キックは、チャンネルから一時的にユーザーを追い出す権限です。キックされたユーザーは、チャンネルに再度参加することができます。
DBにその状態を保存する必要は無い。

バンは、チャンネルからユーザーを永久に追い出す権限です。バンされたユーザーは、チャンネルに再度参加することができません。
したがって、DBにその状態を保存する必要があります。

ミュートは、チャンネルで一定時間、ユーザーが発言できないようにする権限です。ミュートされたユーザーは、チャンネルで発言することができません。
したがって、DBにその状態を保存する必要があります。

バンとミュートについては、管理者メニュー内に、それぞれのリストを表示することができるようにします。
また、そのリストから、バンやミュートを解除することができるようにします。
*/

import React, { useState } from 'react'
import { ChatRoomWithOutPassword, User } from '../../types/types'
import { UserSearchModal } from '@/app/components/Modals/UserSearchModal'
import { BanListDropDown } from '@/app/components/dropdowns/BanListDropDown'
import { MuteListDropDown } from '@/app/components/dropdowns/MuteListDropDown'

interface AdminMenuModalProps {
  onClose: () => void
  currentRoom: ChatRoomWithOutPassword
  wsKickUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsBanUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsMuteUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsUnBanUser: (room: ChatRoomWithOutPassword, user: User) => void
  wsUnMuteUser: (room: ChatRoomWithOutPassword, user: User) => void
}

export function AdminMenuModal({
  onClose,
  currentRoom,
  wsKickUser,
  wsBanUser,
  wsMuteUser,
  wsUnBanUser,
  wsUnMuteUser,
}: AdminMenuModalProps) {
  const [showMuteSeachModal, setShowMuteSeachModal] = useState(false)
  const openMuteSeachModal = () => {
    setShowMuteSeachModal(true)
  }
  const closeMuteSeachModal = () => {
    setShowMuteSeachModal(false)
  }
  const muteHnadler = (user: User) => {
    wsMuteUser(currentRoom, user)
  }

  const [showKickSeachModal, setShowKickSeachModal] = useState(false)
  const openKickSeachModal = () => {
    setShowKickSeachModal(true)
  }
  const closeKickSeachModal = () => {
    setShowKickSeachModal(false)
  }
  const kickHnadler = (user: User) => {
    wsKickUser(currentRoom, user)
  }

  const [showBanSeachModal, setShowBanSeachModal] = useState(false)
  const openBanSeachModal = () => {
    setShowBanSeachModal(true)
  }
  const closeBanSeachModal = () => {
    setShowBanSeachModal(false)
  }
  const banHnadler = (user: User) => {
    wsBanUser(currentRoom, user)
  }

  const [showBanList, setShowBanList] = useState(false)
  const openBanList = () => {
    setShowBanList(true)
  }
  const closeBanList = () => {
    setShowBanList(false)
  }

  const [showMutelist, setShowMutelist] = useState(false)
  const openMuteList = () => {
    setShowMutelist(true)
  }
  const closeMuteList = () => {
    setShowMutelist(false)
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
          Admin Menu
        </span>

        <button
          onClick={openMuteSeachModal}
          className="px-4 py-2 hover:bg-gray-300"
        >
          Mute
        </button>
        <button
          onClick={openKickSeachModal}
          className="px-4 py-2 hover:bg-gray-300"
        >
          Kick
        </button>
        <button
          onClick={openBanSeachModal}
          className="px-4 py-2 hover:bg-gray-300"
        >
          Ban
        </button>
        <button onClick={openMuteList} className="px-4 py-2 hover:bg-gray-300">
          Mute List
        </button>
        <button onClick={openBanList} className="px-4 py-2 hover:bg-gray-300">
          Ban List
        </button>
      </div>

      {showMuteSeachModal && (
        <UserSearchModal
          onClickHandler={muteHnadler}
          onClose={closeMuteSeachModal}
          guideMessage="Click on the name in the search results to mute thefuser for 7days."
        />
      )}

      {showKickSeachModal && (
        <UserSearchModal
          onClickHandler={kickHnadler}
          onClose={closeKickSeachModal}
          guideMessage="Click on the name in the search results to kick."
        />
      )}

      {showBanSeachModal && (
        <UserSearchModal
          onClickHandler={banHnadler}
          onClose={closeBanSeachModal}
          guideMessage="Click on the name in the search results to ban."
        />
      )}

      {showBanList && (
        <BanListDropDown
          onClose={closeBanList}
          currentRoom={currentRoom}
          wsUnBanUser={wsUnBanUser}
        />
      )}

      {showMutelist && (
        <MuteListDropDown
          onClose={closeMuteList}
          currentRoom={currentRoom}
          wsUnMuteUser={wsUnMuteUser}
        />
      )}
    </div>
  )
}
