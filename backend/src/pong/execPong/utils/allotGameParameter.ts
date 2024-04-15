import { GameParameter, GameParameters } from '../types'

const DEFAULT = 2

const allotBallSpeed = (ballSpeed: number) => {
  switch (ballSpeed) {
    case 0:
      return 1.0
    case 1:
      return 1.5
    case DEFAULT:
      return 2.0
    case 3:
      return 3.0
    case 4:
      return 4.0
    default:
      return 8.0
  }
}

const allotPaddleSpeed = (paddleSpeed: number) => {
  switch (paddleSpeed) {
    case 0:
      return 4
    case 1:
      return 7
    case DEFAULT:
      return 10
    case 3:
      return 13
    case 4:
      return 16
    default:
      return 20
  }
}

const allotGravity = (gravity: number) => {
  switch (gravity) {
    case 0:
      return -0.25
    case 1:
      return -0.1
    case DEFAULT:
      return 0
    case 3:
      return 0.1
    case 4:
      return 0.25
    default:
      return 15
  }
}

export const allotDefultGameParameter = () => {
  const defaultGameParameter: GameParameters = {
    ballSpeed: allotBallSpeed(DEFAULT),
    paddleSpeed: allotPaddleSpeed(DEFAULT),
    gravity: allotGravity(DEFAULT),
  }
  return defaultGameParameter
}

export const allotGameParameter = (gameParameterArray: GameParameter[]) => {
  const gameParameter: GameParameters = {
    ballSpeed: 1.0,
    paddleSpeed: 8,
    gravity: 0,
  }

  for (let i = 0; i < gameParameterArray.length; i++) {
    if (gameParameterArray[i].text === 'BALL SPEED') {
      gameParameter.ballSpeed = allotBallSpeed(
        gameParameterArray[i].gameParameter
      )
    } else if (gameParameterArray[i].text === 'PADDLE SPEED') {
      gameParameter.paddleSpeed = allotPaddleSpeed(
        gameParameterArray[i].gameParameter
      )
    } else if (gameParameterArray[i].text === 'GRAVITY') {
      gameParameter.gravity = allotGravity(gameParameterArray[i].gameParameter)
    }
  }
  return gameParameter
}
