const Stars: React.FC<{
  gameParameterNum: number
  index: number
}> = ({ gameParameterNum, index }) => {
  return (
    <svg
      className={`w-6 h-6 `}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      fill={index <= gameParameterNum ? 'white' : 'none'}
      stroke="white"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M12 2L9 9H2l6 6L6 22l6-4 6 4-3-7 6-6h-7z" />
    </svg>
  )
}

export default Stars
