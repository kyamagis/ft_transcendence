'use client'

import Image from 'next/image'
import React, { useEffect, useState } from 'react'
import image from '@/../public/load.png'
import { ScreenManagement } from '../enums'

const RotateImage: React.FC = () => {
  const [rotationState, setRotationState] = useState(0)

  useEffect(() => {
    const intervalID = setInterval(() => {
      setRotationState((prevRotation) => (prevRotation + 90) % 360)
    }, 100)
    return () => {
      clearInterval(intervalID)
    }
  }, [])

  return (
    <Image
      className="mt-10"
      src={image}
      alt="pong logo"
      style={{
        transform: `rotate(${rotationState}deg)`,
        width: '10%',
        height: 'auto',
        maxWidth: '100%',
      }}
    />
  )
}

const MatchWaiting: React.FC<{
  setScreenManagementState: React.Dispatch<
    React.SetStateAction<ScreenManagement>
  >
  reasonForWaiting: string
}> = ({ setScreenManagementState, reasonForWaiting }) => {
  const buttonHandler = () => {
    setScreenManagementState(ScreenManagement.PongHome)
  }
  return (
    <div className="pongbackground flex flex-col justify-center items-center h-screen">
      <h1 className="text-6xl text-center font-century-gothic">
        {reasonForWaiting}
      </h1>
      <RotateImage />
      <button
        className="text-4xl text-center font-century-gothic mt-10"
        onClick={buttonHandler}
      >
        QUIT
      </button>
    </div>
  )
}

export default MatchWaiting
