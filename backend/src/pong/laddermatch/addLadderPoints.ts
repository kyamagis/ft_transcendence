import { PongRepository } from '@/repository/pong.repository'
import { Socket } from 'socket.io'
import { MIN_LADDER_POINTS } from '../execPong/constant'

const MAX_LADDER_POINTS = 1000

const ctrlEarnedLadderPointsMinMax = (
  earnedLadderPoints: number,
  currentLaddepoints: number
) => {
  earnedLadderPoints += currentLaddepoints
  if (earnedLadderPoints < MIN_LADDER_POINTS) {
    earnedLadderPoints = MIN_LADDER_POINTS
  } else if (MAX_LADDER_POINTS < earnedLadderPoints) {
    earnedLadderPoints = MAX_LADDER_POINTS
  }
  return earnedLadderPoints
}

const addLadderPoints = (
  pongRepo: PongRepository,
  client: Socket | undefined,
  earnedLadderpoints: number,
  userID: number
) => {
  const user = pongRepo
    .getUserByID(userID)
    .then((user) => {
      earnedLadderpoints = ctrlEarnedLadderPointsMinMax(
        earnedLadderpoints,
        user.ladderpoints
      )
      pongRepo
        .updateLadderPoints(userID, earnedLadderpoints)
        .then(() =>
          console.log(`userID: ${userID} ladder points :${earnedLadderpoints}`)
        )
        .catch((error) => {
          console.error(error)
          if (client !== undefined) {
            client.emit(
              'errors_handled_after_game_over',
              'Could Not Update Ladder Points'
            )
          }
        })
    })
    .catch((error) => {
      console.error(error)
      if (client !== undefined) {
        client.emit('errors_handled_after_game_over', 'Not Found Your ID')
      }
    })
}

export default addLadderPoints
