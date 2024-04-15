import { Module } from '@nestjs/common'
import { UserSearchService } from './user-search.service'
import { UserSearchController } from './user-search.controller'
import { PrismaService } from '@/prisma/prisma.service'
import { UserSearchRepository } from '@/user-search/user-search.repository'
import { SessionRepository } from '@/repository/session.repository'

@Module({
  controllers: [UserSearchController],
  providers: [
    UserSearchService,
    PrismaService,
    UserSearchRepository,
    SessionRepository,
  ],
})
export class UserSearchModule {}
