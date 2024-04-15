'use client'

import { useEffect } from 'react'

import DuringAMatch from '../computils/DuringAMatch'
import { GameParameter } from '../types'
import { ScreenManagement } from '../enums'
import { useAuth } from '@/app/auth'
import usePongObjects from '../hooks/usePongObjects'
import commonMatchSetting from '../funcutils/commonMatchSetting'
import cleanup from '../funcutils/cleanup'

const URL = 'http://localhost:3000/pong/vscpu'

const VSCpu: React.FC<{
  gameParameterArray: GameParameter[]
  errorMessageRef: React.MutableRefObject<string>
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({ gameParameterArray, errorMessageRef, setScreenManagementState }) => {
  const { ballRef, myselfRef, opponentRef, setRenderingFlgState } =
    usePongObjects()
  const { userData } = useAuth()

  useEffect(() => {
    if (!userData?.id) {
      errorMessageRef.current = 'Could Not Get User ID'
      setScreenManagementState(ScreenManagement.Error)
      return
    }

    const userID = userData?.id
    const socket = commonMatchSetting(
      errorMessageRef,
      setScreenManagementState,
      URL,
      userID
    )

    socket.on('session_ok', () => {
      socket.emit('vscpu', gameParameterArray)
    })

    // サーバーから送られる物体の位置とポイントの受け取り
    socket.on('game_pos_and_point', (ball, myself, opponent) => {
      ballRef.current = ball
      myselfRef.current = myself
      opponentRef.current = opponent
      setRenderingFlgState((prevState) => !prevState)
    })
    // gameover
    socket.on('gameover', () => {
      setScreenManagementState(ScreenManagement.PongHome)
    })

    return () => {
      cleanup(socket, userID)
    }
  }, [])
  return (
    <DuringAMatch
      ballRef={ballRef}
      myselfRef={myselfRef}
      opponentRef={opponentRef}
    />
  )
}

export default VSCpu
