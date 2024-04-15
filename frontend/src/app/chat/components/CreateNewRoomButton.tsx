interface onClickType {
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function CreateNewRoomButton({ onClick }: onClickType) {
  return (
    <button
      className="py-2 px-4 my-2 mx-4 bg-green-200 hover:bg-green-300 bg-opacity-50 rounded focus:outline-none"
      onClick={onClick}
    >
      Create New Room
    </button>
  )
}
