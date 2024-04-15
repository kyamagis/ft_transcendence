import { Ball, Player, GameParameters } from '../types'
import { BG_WIDTH, BG_HEIGHT, BALL_DIAMETER } from '../constant'
import calcCollisionWallOrPaddle from './calcCollisionWallOrPaddle'

const calcBallBehavior = (
  gameParameters: GameParameters,
  ball: Ball,
  myself: Player,
  opponent: Player,
  gameover: {
    flg: boolean
  }
) => {
  const newXPos: number = ball.x + ball.vx
  ball.vy += gameParameters.gravity
  const newYPos: number = ball.y + ball.vy

  if (newXPos < 0) {
    // ボールが左端に来たとき
    calcCollisionWallOrPaddle(
      gameParameters,
      newYPos,
      ball,
      myself,
      opponent,
      gameover
    )
  } else if (BG_WIDTH < newXPos + BALL_DIAMETER) {
    // ボールが右端に来たとき
    calcCollisionWallOrPaddle(
      gameParameters,
      newYPos,
      ball,
      opponent,
      myself,
      gameover
    )
  } else if (newYPos <= 0 || BG_HEIGHT - BALL_DIAMETER <= newYPos) {
    // ボールが上下の壁に接触したとき
    ball.vy *= -1
  } else {
    ball.x = newXPos
    ball.y = newYPos
  }
}

export default calcBallBehavior
