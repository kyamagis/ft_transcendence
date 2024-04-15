import { RoomType } from '../../types/types'
import { PasswordInputArea } from './PasswordInputArea'
import { SubmitButton } from './SubmitButton'

interface propsType {
  setNewRoomType: (roomType: RoomType) => void
  setNewRoomName: (roomName: string) => void
  setNewRoomPassword: (roomPassword: string) => void
  wsCreateRoom: (roomName?: string, roomType?: RoomType) => void
  closeRoomCreateModal: () => void
  newRoomType: RoomType
  newRoomName: string
}

export function RoomCreateModal({
  setNewRoomType,
  setNewRoomName,
  setNewRoomPassword,
  wsCreateRoom,
  closeRoomCreateModal,
  newRoomType,
  newRoomName,
}: propsType) {
  return (
    <div
      className="fixed inset-0 flex items-center justify-center z-50"
      onClick={() => {
        setNewRoomType(RoomType.PUBLIC)
        setNewRoomName('')
        setNewRoomPassword('')
        closeRoomCreateModal()
      }}
    >
      <div
        className="bg-green-200 bg-opacity-50 p-4 rounded"
        onClick={(e) => e.stopPropagation()}
      >
        <div>
          <label className="mr-3">
            <input
              type="radio"
              name="roomType"
              value="public"
              defaultChecked // Publicをデフォルトに設定
              onChange={() => setNewRoomType(RoomType.PUBLIC)}
            />
            Public
          </label>
          <label className="mr-3">
            <input
              type="radio"
              name="roomType"
              value="private"
              onChange={() => setNewRoomType(RoomType.PRIVATE)}
            />
            Private
          </label>
          <label className="mr-3">
            <input
              type="radio"
              name="roomType"
              value="passwordProtected"
              onChange={() => setNewRoomType(RoomType.PASSWORD_PROTECTED)}
            />
            PasswordProtected
          </label>
        </div>

        <div className="flex flex-col mt-3">
          <span>New Room Name</span>
          <input
            type="text"
            value={newRoomName}
            className="border rounded p-1 flex-1 min-w-0"
            onChange={(e) => setNewRoomName(e.target.value)}
          />
        </div>

        {newRoomType === RoomType.PASSWORD_PROTECTED && (
          <PasswordInputArea
            onChangeCallFC={setNewRoomPassword}
            helperText="Password requires 6character lowercase, uppercase, and a number."
          />
        )}
        <SubmitButton submitHandler={wsCreateRoom} />
      </div>
    </div>
  )
}
