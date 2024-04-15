import { Module } from '@nestjs/common'

import { AuthService } from './auth.service'
import { AuthController } from './auth.controller'

import { PrismaService } from '@/prisma/prisma.service'
import { UserRepository } from '@/user/user.repository'
import { FtAccountRepository } from '@/repository/ft-account.repository'

import { PassportModule } from '@nestjs/passport'
import { FtStrategy } from './strategies/ft-oauth.strategy'
import { SessionSerializer } from './session/session.serializer'
import { SessionRepository } from '@/repository/session.repository'
import { GoogleAccountRepository } from '@/repository/google-account.repository'
import { GoogleStrategy } from './strategies/google-oauth.trategy'

@Module({
  imports: [PassportModule.register({ session: true })],
  controllers: [AuthController],
  providers: [
    AuthService,
    FtStrategy,
    GoogleStrategy,
    SessionSerializer,
    PrismaService,
    UserRepository,
    SessionRepository,
    FtAccountRepository,
    GoogleAccountRepository,
  ],
})
export class AuthModule {}
