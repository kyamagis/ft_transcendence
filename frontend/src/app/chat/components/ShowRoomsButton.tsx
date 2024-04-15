interface propsType {
  type: string
  onClick: React.MouseEventHandler<HTMLButtonElement>
}

export function ShowRoomsButton({ type, onClick }: propsType) {
  return (
    <div className="flex border-t">
      <button
        className="flex-grow py-2 px-4 my-2 mx-4 bg-gray-200 hover:bg-gray-300 bg-opacity-50 rounded focus:outline-none"
        onClick={onClick}
      >
        {type}
      </button>
    </div>
  )
}
