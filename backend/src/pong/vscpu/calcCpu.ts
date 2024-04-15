import {
  BG_WIDTH,
  BG_HEIGHT,
  BALL_DIAMETER,
  PADDLE_HEIGHT,
  CPU_SPEED,
} from '../execPong/constant'
import { Ball, Player } from '../execPong/types'

const calcCpu = (ball: Ball, opponent: Player) => {
  if (0 < ball.vx && BG_WIDTH / 2 < ball.x) {
    if (ball.y < opponent.paddlePos) {
      opponent.paddlePos -= CPU_SPEED
    } else if (opponent.paddlePos + PADDLE_HEIGHT < ball.y + BALL_DIAMETER) {
      opponent.paddlePos += CPU_SPEED
    }
  } else if (ball.vx < 0) {
    if (opponent.paddlePos + PADDLE_HEIGHT / 2 < BG_HEIGHT / 2) {
      opponent.paddlePos += 1
    } else if (BG_HEIGHT / 2 < opponent.paddlePos + PADDLE_HEIGHT / 2) {
      opponent.paddlePos -= 1
    }
  }
}

export default calcCpu
