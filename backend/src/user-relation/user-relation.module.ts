import { Module } from '@nestjs/common'
import { UserRelationService } from './user-relation.service'
import { UserRelationController } from './user-relation.controller'
import { UserRelationRepository } from './user-relation.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { SessionRepository } from '@/repository/session.repository'

@Module({
  controllers: [UserRelationController],
  providers: [
    UserRelationService,
    UserRelationRepository,
    PrismaService,
    SessionRepository,
  ],
})
export class UserRelationModule {}
