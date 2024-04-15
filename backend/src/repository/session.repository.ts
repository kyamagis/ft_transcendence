import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Session, Prisma } from '@prisma/client'

@Injectable()
export class SessionRepository {
  constructor(private readonly prisma: PrismaService) {}
  async findSessionById(sessionId: string) {
    const session = await this.prisma.session.findUnique({
      where: { sid: sessionId },
    })

    return session
  }

  async updateSession(session: Prisma.SessionUpdateInput): Promise<Session> {
    return await this.prisma.session.update({
      where: { sid: session.sid.toString() },
      data: session,
    })
  }
}
