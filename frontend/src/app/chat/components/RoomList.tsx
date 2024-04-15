import { ChatRoomWithOutPassword, RoomType } from '../../types/types'

interface propsType {
  roomList: ChatRoomWithOutPassword[]
  showRoomType: RoomType
  currentRoom: ChatRoomWithOutPassword | null
  wsLeaveRoom: (room: ChatRoomWithOutPassword | null) => void
  wsJoinRoom: (room: ChatRoomWithOutPassword) => void
}

export function RoomList({
  roomList,
  showRoomType,
  currentRoom,
  wsLeaveRoom,
  wsJoinRoom,
}: propsType) {
  console.log('showRoomType', showRoomType)
  console.log('roomList', roomList)
  roomList
    .filter((room) => room.roomType === showRoomType)
    .map((room, index) => console.log('room: ' + index + ' ' + room.roomName))

  return (
    <ul>
      {roomList
        .filter((room) => room.roomType === showRoomType)
        .map((room, index) => (
          <li
            key={index}
            className="flex justify-between items-center hover:bg-gray-100 p-2"
          >
            <button
              className="flex-grow flex items-center justify-between opacity-90 hover:opacity-100 focus:outline-none"
              onClick={() => {
                if (currentRoom?.id === room.id) return
                wsLeaveRoom(currentRoom)
                wsJoinRoom(room)
              }}
            >
              <span>{room.roomName}</span>
            </button>
          </li>
        ))}
    </ul>
  )
}
