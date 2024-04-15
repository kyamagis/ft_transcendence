const StarButton: React.FC<{
  gameParameterRef: React.MutableRefObject<number>
  setRenderingFlg: React.Dispatch<React.SetStateAction<boolean>>
  index: number
}> = ({ gameParameterRef, setRenderingFlg, index }) => {
  const handleClick = () => {
    if (index === gameParameterRef.current && 0 < index) {
      gameParameterRef.current -= 1
      setRenderingFlg((prevState) => !prevState)
    } else {
      gameParameterRef.current = index
      setRenderingFlg((prevState) => !prevState)
    }
  }

  return (
    <button className="starbuttun" onClick={handleClick}>
      <svg
        className={`w-6 h-6 `}
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        fill={index <= gameParameterRef.current ? 'white' : 'none'}
        stroke="white"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      >
        <path d="M12 2L9 9H2l6 6L6 22l6-4 6 4-3-7 6-6h-7z" />
      </svg>
    </button>
  )
}

export default StarButton
