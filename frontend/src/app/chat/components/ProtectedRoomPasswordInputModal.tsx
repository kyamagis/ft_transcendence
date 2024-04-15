import { Socket } from 'socket.io-client'
import { ChatRoomWithOutPassword } from '../../types/types'

interface propsType {
  setRoomPassword: (roomPassword: string) => void
  closeRoomPasswordInputModal: () => void
  currentRoom: ChatRoomWithOutPassword | null
  roomPassword: string
  socket: Socket | null
}

export function ProtectedRoomPasswordInputModal({
  setRoomPassword,
  closeRoomPasswordInputModal,
  currentRoom,
  roomPassword,
  socket,
}: propsType) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => {
        setRoomPassword('')
        closeRoomPasswordInputModal()
      }}
    >
      <div
        className="bg-green-200 bg-opacity-50 p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex flex-col mt-3">
          <span>Password</span>
          <input
            type="password"
            className="border rounded p-1 flex-1 min-w-0"
            onChange={(e) => {
              setRoomPassword(e.target.value)
            }}
          />
        </div>

        <button
          className="mt-2 px-4 py-2 bg-gray-800 bg-opacity-70 text-white rounded"
          onClick={() => {
            if (!socket) return
            if (!currentRoom) return
            socket.emit('send_room_password', { currentRoom, roomPassword })
            setRoomPassword('')
            closeRoomPasswordInputModal()
          }}
        >
          Submit
        </button>
      </div>
    </div>
  )
}
