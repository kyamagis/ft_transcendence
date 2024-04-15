'use client'

import { useState } from 'react'
import StarButton from './StarButton'
import { GameParameterRef } from '../types'

const GameParameterButton: React.FC<{
  gameParameterRef: GameParameterRef
}> = ({ gameParameterRef}) => {
  const content = []
  const [, setRenderingFlg] = useState(false)

  for (let index = 0; index < gameParameterRef.maxLevel; index++) {
    content.push(
      <span className="ponglh" key={index}>
        <StarButton
          gameParameterRef={gameParameterRef.gameParameterRef}
          setRenderingFlg={setRenderingFlg}
          index={index}
        />
      </span>
    )
  }

  return <>{content}</>
}

export default GameParameterButton
