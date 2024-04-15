import { Ball, Player, GameParameters } from '../types'
import { BALL_DIAMETER, BALL_RADIUS, PADDLE_HEIGHT } from '../constant'
import servBall from './servBall'

const setBall = (
  gameParameters: GameParameters,
  ball: Ball,
  reflectedVx: number,
  reflectedVy: number
) => {
  return {
    x: ball.x,
    y: ball.y,
    vx: reflectedVx * gameParameters.ballSpeed,
    vy: reflectedVy * gameParameters.ballSpeed,
  }
}

const zeroGravity = (
  gameParameters: GameParameters,
  newYPos: number,
  ball: Ball,
  paddlePos: number
) => {
  const centerOfBall: number = newYPos + BALL_RADIUS
  let directionOfBall = 1

  if (0 < ball.vx) {
    directionOfBall = -1
  }

  if (centerOfBall < paddlePos + 5) {
    return setBall(gameParameters, ball, directionOfBall * 3, -6)
  } else if (centerOfBall < paddlePos + 30) {
    return setBall(gameParameters, ball, directionOfBall * 2, -2)
  } else if (centerOfBall < paddlePos + 45) {
    return setBall(gameParameters, ball, directionOfBall * 20, 0)
  } else if (centerOfBall <= paddlePos + 70) {
    return setBall(gameParameters, ball, directionOfBall * 2, 2)
  } else if (paddlePos + 70 < centerOfBall) {
    return setBall(gameParameters, ball, directionOfBall * 3, 6)
  }
  return setBall(gameParameters, ball, directionOfBall * 10, 0)
}

const onGravity = (
  gameParameters: GameParameters,
  newYPos: number,
  ball: Ball,
  paddlePos: number
) => {
  const centerOfBall: number = newYPos + BALL_RADIUS
  let directionOfBall = 1

  if (0 < ball.vx) {
    directionOfBall = -1
  }

  if (centerOfBall < paddlePos + 5) {
    return setBall(gameParameters, ball, directionOfBall * 4, -8)
  } else if (centerOfBall < paddlePos + 30) {
    return setBall(gameParameters, ball, directionOfBall * 3, -6)
  } else if (centerOfBall < paddlePos + 45) {
    return setBall(gameParameters, ball, directionOfBall * 10, -5)
  } else if (centerOfBall <= paddlePos + 70) {
    return setBall(gameParameters, ball, directionOfBall * 3, -4)
  } else if (paddlePos + 70 < centerOfBall) {
    return setBall(gameParameters, ball, directionOfBall * 4, -8)
  }
  return setBall(gameParameters, ball, directionOfBall * 10, 0)
}

const changeBallSpeedAndAngle = (
  gameParameters: GameParameters,
  newYPos: number,
  ball: Ball,
  paddlePos: number
) => {
  if (gameParameters.gravity === 0) {
    return zeroGravity(gameParameters, newYPos, ball, paddlePos)
  }
  return onGravity(gameParameters, newYPos, ball, paddlePos)
}

const substituteBall = (ball: Ball, tmp: Ball) => {
  ball.x = tmp.x
  ball.y = tmp.y
  ball.vx = tmp.vx
  ball.vy = tmp.vy
}

const calcCollisionWallOrPaddle = (
  gameParameters: GameParameters,
  newYPos: number,
  ball: Ball,
  myPlayer: Player,
  opponentPlayer: Player,
  gameover: {
    flg: boolean
  }
) => {
  if (
    newYPos + BALL_DIAMETER < myPlayer.paddlePos ||
    myPlayer.paddlePos + PADDLE_HEIGHT < newYPos
  ) {
    opponentPlayer.score += 1
    if (3 < opponentPlayer.score) {
      gameover.flg = true
      return
    }
    substituteBall(ball, servBall(gameParameters))
  } else
    substituteBall(
      ball,
      changeBallSpeedAndAngle(gameParameters, newYPos, ball, myPlayer.paddlePos)
    )
}

export default calcCollisionWallOrPaddle
