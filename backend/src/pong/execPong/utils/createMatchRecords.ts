import { Socket } from 'socket.io'
import { PongRepository } from '@/repository/pong.repository'
import { MatchType } from '@prisma/client'

const createMatchRecords = (
  pongRepo: PongRepository,
  host: Socket,
  matchtype: MatchType,
  hostScore: number,
  guestScore: number,
  abstainedFlg: boolean,
  hostUserID: number,
  guestUserID: number
) => {
  pongRepo
    .createMatchRecord(
      matchtype,
      hostUserID,
      guestUserID,
      hostScore,
      guestScore
    )
    .catch((error) => {
      console.error(error)
      if (!abstainedFlg) {
        host.emit(
          'errors_handled_after_game_over',
          'Could Not Create Match Record '
        )
      }
    })
  pongRepo
    .createMatchRecord(
      matchtype,
      guestUserID,
      hostUserID,
      guestScore,
      hostScore
    )
    .catch((error) => {
      console.error(error)
      if (!abstainedFlg) {
        host.emit(
          'errors_handled_after_game_over',
          'Could Not Create Match Record '
        )
      }
    })
}

export default createMatchRecords
