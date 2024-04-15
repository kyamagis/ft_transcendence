'use client'

import Image from 'next/image'
import Link from 'next/link'
import LinksDropDown from '@/app/components/dropdowns/linksDropdown'
import { useLogout, useAuth } from '@/app/auth'
import { useState } from 'react'
import { ProfileModal } from '../Modals/ProfileModal'
import { EditProfileModal } from '../Modals/EditProfileModal'
import { FriendListDropDown } from '../dropdowns/FriendListDropDown'
import { BlockListDropDown } from '../dropdowns/BlockListDropDown'

// ページ上部に表示するナビゲーションバー
const Navigation = () => {
  const { authStatus, userData } = useAuth()
  const handleLogout = useLogout()
  const [showProfileModal, setShowProfileModal] = useState(false)
  const openProfileModal = () => {
    setShowProfileModal(true)
  }
  const [showEditProfileModal, setShowEditProfileModal] = useState(false)
  const openEditProfileModal = () => {
    setShowEditProfileModal(true)
  }

  const [showFriendListModal, setShowFriendListModal] = useState(false)
  const openFriendListModal = () => {
    setShowFriendListModal(true)
  }

  const [showBlockListModal, setShowBlockListModal] = useState(false)
  const openBlockListModal = () => {
    setShowBlockListModal(true)
  }

  if (authStatus !== 'AUTHORIZED' || !userData) return null
  return (
    <nav className="bg-gray-800 bg-opacity-60">
      <div className="mx-auto max-w-7xl px-2 sm:px-6 lg:px-8">
        <div className="relative flex h-16 items-center justify-between">
          <div className="flex flex-1 items-center justify-center sm:items-stretch sm:justify-start">
            {/* 左上のアイコン */}
            <Link href="/">
              <div className="flex flex-shrink-0 items-center">
                <Image
                  src="/favicon2.png"
                  alt="favicon"
                  width={55}
                  height={55}
                />
              </div>
            </Link>
            {/* ナビゲーションリンク達　ページのロードは起こらないのでSPAの定義内 */}
            <div className="hidden sm:ml-6 sm:block">
              <div className="flex space-x-4">
                {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
                <Link
                  href="/pong"
                  className="text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-2 py-2 text-m font-medium"
                >
                  Pong
                </Link>
                <Link
                  href="/chat"
                  className="text-gray-100 hover:bg-gray-700 hover:text-white rounded-md px-2 py-2 text-m font-medium"
                >
                  Chat
                </Link>
              </div>
            </div>
          </div>

          {/* 右上のアイコン達 */}
          <div className="absolute inset-y-0 right-0 flex items-center pr-5 sm:static sm:inset-auto sm:ml-6 sm:pr-0">
            {/* アバター画像をトリガーにしたモーダル機能　モーダル機能は共通コンポーネントにしました */}
            <LinksDropDown
              trigger={
                userData.avatar ? (
                  <Image
                    className="rounded-full"
                    src={`data:image/jpeg;base64,${Buffer.from(
                      userData.avatar
                    ).toString('base64')}`}
                    alt="avatar"
                    width={55}
                    height={55}
                  />
                ) : (
                  <Image
                    className="rounded-full"
                    src="/defaultAvatar.png"
                    alt="avatar"
                    width={55}
                    height={55}
                  />
                )
              }
              // modalContent="This is a modal"
              modalLinks={[
                {
                  text: 'Your Profile',
                  onClick: openProfileModal,
                },
                { text: 'Edit Profile', onClick: openEditProfileModal },
                { text: 'Friend List', onClick: openFriendListModal },
                { text: 'Block List', onClick: openBlockListModal },
                { text: 'Log Out', onClick: handleLogout },
              ]}
            />
          </div>
        </div>
      </div>

      {/* <!-- Mobile menu, show/hide based on menu state. --> */}
      <div className="sm:hidden" id="mobile-menu">
        <div className="space-y-1 px-2 pb-3 pt-2">
          {/* <!-- Current: "bg-gray-900 text-white", Default: "text-gray-300 hover:bg-gray-700 hover:text-white" --> */}
          <Link
            href="#"
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            Pong
          </Link>
          <Link
            href="/chat"
            className="text-gray-300 hover:bg-gray-700 hover:text-white rounded-md px-3 py-2 text-sm font-medium"
          >
            Chat
          </Link>
        </div>
      </div>

      {/* Modals */}
      {showProfileModal && (
        <ProfileModal
          onClose={() => setShowProfileModal(false)}
          userID={userData.id}
        />
      )}
      {showEditProfileModal && (
        <EditProfileModal
          onClose={() => setShowEditProfileModal(false)}
          userID={userData.id}
        />
      )}
      {showFriendListModal && (
        <FriendListDropDown
          onClose={() => setShowFriendListModal(false)}
          userID={userData.id}
        />
      )}
      {showBlockListModal && (
        <BlockListDropDown
          onClose={() => setShowBlockListModal(false)}
          userID={userData.id}
        />
      )}
    </nav>
  )
}

export default Navigation
