import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { MatchRecord, MatchType, Session, User } from '@prisma/client'
import { Logger } from '@nestjs/common'

@Injectable()
export class PongRepository {
  constructor(private readonly prisma: PrismaService) {}
  logger: Logger = new Logger('PongRepository')

  async getUserByID(userID: number): Promise<User | null> {
    return await this.prisma.user.findUnique({
      where: {
        id: userID,
      },
    })
  }

  async updateLadderPoints(
    userID: number,
    ladderPoints: number
  ): Promise<User | null> {
    return await this.prisma.user.update({
      where: { id: userID },
      data: { ladderpoints: ladderPoints },
    })
  }

  async createMatchRecord(
    matchType: MatchType,
    myID: number,
    opponentID: number,
    myScore: number,
    opponentScore: number
  ): Promise<MatchRecord | null> {
    const createdMatchRecord = await this.prisma.matchRecord.create({
      data: {
        matchtype: matchType,
        user: { connect: { id: myID } },
        opponentid: opponentID,
        myscore: myScore,
        opponentscore: opponentScore,
      },
    })
    return createdMatchRecord
  }

  async getSessionByUserId(userId: number): Promise<Session> {
    return await this.prisma.session.findFirst({
      where: {
        userId: userId,
      },
    })
  }
}
