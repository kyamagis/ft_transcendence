import React, { useState } from 'react'
import { ChatRoomWithOutPassword } from '@/app/types/types'

interface SetPasswordModalProps {
  onClose: () => void
  setPasswordHandler: (password: string) => void
  currentRoom: ChatRoomWithOutPassword
}

export function SetPasswordModal({
  onClose,
  setPasswordHandler,
  currentRoom,
}: SetPasswordModalProps) {
  const [password, setPassword] = useState('')

  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50" // Adjusted here
      onClick={onClose}
    >
      <div
        className="bg-green-200 bg-opacity-90 p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3">
          <h3 className="text-lg font-bold">
            {currentRoom.roomType ? 'Change Password' : 'Set Password'}
          </h3>
        </div>
        <div className="flex flex-col mt-3">
          <span>{currentRoom.roomType ? 'New Password' : 'Password'}</span>
          <input
            type="password"
            className="border rounded p-1 flex-1 min-w-0 mt-1"
            id="password"
            name="password"
            placeholder={
              currentRoom.roomType ? 'Enter new password' : 'Enter password'
            }
            onChange={(e) => setPassword(e.target.value)}
          />
          <span className="text-xs mt-1 text-gray-500">
            Password requires 6character lowercase, uppercase, and a number.
          </span>
        </div>
        <div className="flex justify-end mt-3">
          <button
            className="mr-2 px-4 py-2 bg-gray-300 rounded"
            onClick={onClose}
          >
            Cancel
          </button>
          <button
            className="px-4 py-2 bg-blue-500 text-white rounded"
            onClick={() => {
              setPasswordHandler(password)
              onClose()
            }}
          >
            Set
          </button>
        </div>
      </div>
    </div>
  )
}
