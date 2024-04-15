'use client'

import React, { useState, useRef } from 'react'
import PongHome from './PongHome'
import LadderMatch from './matchs/LadderMatch'
import { GameParameterRefArray, Scores, initScoresRef } from './types'
import { ScreenManagement } from './enums'
import VSCpu from './matchs/VSCpu'
import gameParameterRefToNumber from './funcutils/gameParameterRefToNumber'
import { GAME_PARAMETER_MAX_LEVEL } from './constant'
import calcMedian from './funcutils/calcMedian'
import { ResultScreen } from './computils/ResultScreen'
import { PongError } from './computils/PongError'

const Pong: React.FC = () => {
  const gameParameterRefArray: GameParameterRefArray = [
    {
      text: 'BALL SPEED',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
    {
      text: 'PADDLE SPEED',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
    {
      text: 'GRAVITY',
      maxLevel: GAME_PARAMETER_MAX_LEVEL,
      gameParameterRef: useRef<number>(calcMedian(GAME_PARAMETER_MAX_LEVEL)),
    },
  ]

  const errorMessageRef = useRef('')
  const scoresRef = useRef<Scores>(initScoresRef())

  const [screenManagementState, setScreenManagementState] = useState(
    ScreenManagement.PongHome
  )

  switch (screenManagementState) {
    case ScreenManagement.PongHome:
      return (
        <PongHome
          gameParameterRefArray={gameParameterRefArray}
          setScreenManagementState={setScreenManagementState}
        />
      )
    case ScreenManagement.VSCpu:
      return (
        <VSCpu
          gameParameterArray={gameParameterRefToNumber(gameParameterRefArray)}
          errorMessageRef={errorMessageRef}
          setScreenManagementState={setScreenManagementState}
        />
      )
    case ScreenManagement.LadderMatch:
      return (
        <LadderMatch
          scoresRef={scoresRef}
          errorMessageRef={errorMessageRef}
          setScreenManagementState={setScreenManagementState}
        />
      )
    case ScreenManagement.Error:
      return (
        <PongError
          errorMessageRef={errorMessageRef}
          setScreenManagementState={setScreenManagementState}
        />
      )
    case ScreenManagement.ResultScreen:
      return (
        <ResultScreen
          scoresRef={scoresRef}
          setScreenManagementState={setScreenManagementState}
        />
      )
    default:
      return <h1>Error</h1>
  }
}

export default Pong
