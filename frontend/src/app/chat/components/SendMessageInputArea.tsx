import { ChatRoomWithOutPassword } from '../../types/types'

interface propsType {
  onClickCallFC: () => void
  onChangeCallFC: (value: string) => void
  value: string
  currentRoom: ChatRoomWithOutPassword
  id: number
}

export function SendMessaInputArea({
  onClickCallFC,
  onChangeCallFC,
  value,
  currentRoom,
  id,
}: propsType) {
  // currentRoomのuserMutedを確認し、自身がMuteになっていたら、Sendボタンを押せないようにする
  const isMuted = currentRoom.userMuted.find((user) => user.userId === id)

  if (isMuted) {
    return (
      <div className="flex absolute bottom-0 right-0 w-full p-4 bg-gray-500 bg-opacity-50">
        <textarea
          rows={1}
          placeholder="you are muted"
          className="flex flex-grow border opacity-90 rounded p-2"
          disabled={true}
        />
        <button
          className="ml-2 px-4 py-2 rounded bg-gray-400 bg-opacity-70 text-gray-600 cursor-not-allowed"
          onClick={onClickCallFC}
          disabled={true}
        >
          Muted
        </button>
      </div>
    )
  }
  return (
    <div className="flex absolute bottom-0 right-0 w-full p-4 bg-gray-500 bg-opacity-50">
      <textarea
        rows={1}
        placeholder="send message content"
        className="flex flex-grow border opacity-90 rounded p-2"
        value={value}
        onChange={(e) => onChangeCallFC(e.target.value)}
      />
      <button
        className={`ml-2 px-4 py-2 rounded ${
          value
            ? 'bg-gray-800 bg-opacity-90 text-white'
            : 'bg-gray-400 bg-opacity-70 text-gray-600 cursor-not-allowed'
        }`}
        onClick={onClickCallFC}
        disabled={!value}
      >
        Send
      </button>
    </div>
  )
}
