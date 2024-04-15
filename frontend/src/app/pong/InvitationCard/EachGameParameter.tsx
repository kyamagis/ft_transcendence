'use client'

import Stars from './Stars'
import { GameParameter } from '../types'

const EachGameParameter: React.FC<{
  gameParameter: GameParameter
}> = ({ gameParameter }) => {
  const content = []

  for (let index = 0; index < gameParameter.maxLevel; index++) {
    content.push(
      <span className="m-1 text-white" key={index}>
        <Stars gameParameterNum={gameParameter.gameParameter} index={index} />
      </span>
    )
  }

  return (
    <>
      <h2 className="gameparametername">{gameParameter.text}</h2>
      <div className="flex items-center justify-center">
        <span className="pongfont m-5 text-white">L</span>
        {content}
        <span className="pongfont m-5 text-white">H</span>
      </div>
    </>
  )
}

export default EachGameParameter
