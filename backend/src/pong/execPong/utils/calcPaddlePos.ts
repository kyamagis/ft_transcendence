import { BG_HEIGHT, PADDLE_HEIGHT } from '../constant'
import { Direction } from '../enums'
import { GameParameters, PaddleMovement, Player } from '../types'

export const calcPaddlePos = (
  gameParameters: GameParameters,
  player: Player,
  paddleMovement: PaddleMovement
) => {
  if (paddleMovement.MovementDirection === Direction.Up) {
    const newLeftPaddlePos: number =
      player.paddlePos - gameParameters.paddleSpeed

    if (newLeftPaddlePos <= 0) {
      player.paddlePos = 0
    } else {
      player.paddlePos = newLeftPaddlePos
    }
  } else if (paddleMovement.MovementDirection === Direction.Down) {
    const newLeftPaddlePos = player.paddlePos + gameParameters.paddleSpeed

    if (BG_HEIGHT <= newLeftPaddlePos + PADDLE_HEIGHT) {
      player.paddlePos = BG_HEIGHT - PADDLE_HEIGHT
    } else {
      player.paddlePos = newLeftPaddlePos
    }
  }
  if (paddleMovement.isKeyDown === Direction.Neutral) {
    paddleMovement.MovementDirection = Direction.Neutral
  }
}

export default calcPaddlePos
