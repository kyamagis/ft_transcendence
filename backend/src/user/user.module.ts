import { Module, Session } from '@nestjs/common'
import { UserService } from './user.service'
import { UserController } from './user.controller'
import { UserRepository } from '@/user/user.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { SessionRepository } from '@/repository/session.repository'

@Module({
  controllers: [UserController],
  providers: [UserService, PrismaService, UserRepository, SessionRepository],
})
export class UserModule {}
