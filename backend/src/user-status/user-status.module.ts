import { Module } from '@nestjs/common'
import { UserStatusService } from './user-status.service'
import { UserStatusController } from './user-status.controller'
import { SessionRepository } from '@/repository/session.repository'
import { PrismaService } from '@/prisma/prisma.service'

@Module({
  controllers: [UserStatusController],
  providers: [UserStatusService, SessionRepository, PrismaService],
})
export class UserStatusModule {}
