import { Session } from '@prisma/client'
import { Socket } from 'socket.io'
import { PongRepository } from '@/repository/pong.repository'
import { Logger } from '@nestjs/common'

const pongSessionGuard = async (
  pongRepo: PongRepository,
  logger: Logger,
  userID: number,
  client: Socket
) => {
  const session: Session = await pongRepo.getSessionByUserId(userID)

  let errorMessage = undefined
  if (!session) {
    errorMessage = 'session not found for userID: ' + userID
  } else if (!session.expire) {
    errorMessage = 'session expired for userID: ' + userID
  } else if (session.expire < new Date()) {
    errorMessage = 'session expired for userID: ' + userID
    logger.debug(`session: ${session.expire}`)
  }
  if (errorMessage !== undefined) {
    logger.debug(errorMessage)
    client.emit('session_error', errorMessage)
    return undefined
  }
  logger.debug(`session: ${session.expire}`)
  return userID
}

export default pongSessionGuard
