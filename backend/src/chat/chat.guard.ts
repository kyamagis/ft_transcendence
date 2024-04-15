import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Logger } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Session } from '@prisma/client'

@Injectable()
export class ChatSessionGuard implements CanActivate {
  constructor(private prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const logger = new Logger('ChatSessionGuard')
    const userId = parseInt(
      context.switchToWs().getClient().handshake.query.userId
    )
    const session: Session = await this.prisma.session.findFirst({
      where: {
        userId: userId,
      },
    })

    let errorMessages = null

    if (!session) errorMessages = 'session not found for userID: ' + userId
    else if (!session.expire)
      errorMessages = 'session expired for userID: ' + userId
    else if (session.expire < new Date())
      errorMessages = 'session expired for userID: ' + userId

    if (errorMessages) {
      logger.log(errorMessages)
      context.switchToWs().getClient().emit('session_error')
      context.switchToWs().getClient().disconnect()
      return false
    }
    return true
  }
}
