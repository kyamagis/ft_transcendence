'use client'

import Image from 'next/image'
import React, { useEffect } from 'react'
import OptionMode from './optionmode'
import image from '@/../public/favicon2.png'
import { GameParameterRefArray } from './types'
import { ScreenManagement } from './enums'
import { registerStatus } from '@/lib/LoginStatus/registerLoginStatus'
import { useAuth } from '../auth'

const PongHome: React.FC<{
  gameParameterRefArray: GameParameterRefArray
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
}> = ({ gameParameterRefArray, setScreenManagementState }) => {
  const handleClickVSCpu = () => {
    setScreenManagementState(ScreenManagement.VSCpu)
  }

  const handleClickLadderMatch = () => {
    setScreenManagementState(ScreenManagement.LadderMatch)
  }

  const { userData } = useAuth()

  useEffect(() => {
    if (!userData?.id) return
    registerStatus(userData?.id, 'PONG')
  })

  return (
    <div className="pongbackground">
      <Image className="ponglogo" src={image} alt="スーパーどすこい" priority />
      <button onClick={handleClickVSCpu}>
        <h2 className="pongvscpu">V.S. CPU</h2>
      </button>
      <button onClick={handleClickLadderMatch}>
        <h2 className="pongladdermatch">LADDER MATCH</h2>
      </button>
      <OptionMode
        trigger={<h2 className="optionmode">OPTION MODE</h2>}
        gameParameterRefArray={gameParameterRefArray}
      />
    </div>
  )
}

export default PongHome
