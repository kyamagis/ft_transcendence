import { useRef, useState } from 'react'
import { Ball, Player, initBallRef, initPlayerRef } from '../types'

const usePongObjects = () => {
  const [, setRenderingFlgState] = useState(false)
  const ballRef = useRef<Ball>(initBallRef())
  const myselfRef = useRef<Player>(initPlayerRef())
  const opponentRef = useRef<Player>(initPlayerRef())

  return { ballRef, myselfRef, opponentRef, setRenderingFlgState }
}

export default usePongObjects
