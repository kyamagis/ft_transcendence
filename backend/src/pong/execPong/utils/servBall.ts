import { CENTER_OF_BG_X, CENTER_OF_BG_Y } from '../constant'
import { GameParameters } from '../types'

const servBall = (gameParameters: GameParameters) => {
  const now = new Date()
  const seconds = now.getSeconds()
  const seed = seconds % 4

  switch (seed) {
    case 0:
      return {
        x: CENTER_OF_BG_X,
        y: CENTER_OF_BG_Y,
        vx: 2 * gameParameters.ballSpeed,
        vy: 2 * gameParameters.ballSpeed,
        g: gameParameters.gravity,
      }
    case 1:
      return {
        x: CENTER_OF_BG_X,
        y: CENTER_OF_BG_Y,
        vx: -2 * gameParameters.ballSpeed,
        vy: 2 * gameParameters.ballSpeed,
        g: gameParameters.gravity,
      }
    case 2:
      return {
        x: CENTER_OF_BG_X,
        y: CENTER_OF_BG_Y,
        vx: 2 * gameParameters.ballSpeed,
        vy: -2 * gameParameters.ballSpeed,
        g: gameParameters.gravity,
      }
    default:
      return {
        x: CENTER_OF_BG_X,
        y: CENTER_OF_BG_Y,
        vx: -2 * gameParameters.ballSpeed,
        vy: -2 * gameParameters.ballSpeed,
        g: gameParameters.gravity,
      }
  }
}

export default servBall
