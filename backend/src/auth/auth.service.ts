import { Injectable, InternalServerErrorException } from '@nestjs/common'
import AuthMeUser from './types/authme.user.interface'
import { User } from '@prisma/client'
import { SessionRepository } from '@/repository/session.repository'
import * as speakeasy from 'speakeasy'
import * as QRCode from 'qrcode'

@Injectable()
export class AuthService {
  constructor(private sessionRepository: SessionRepository) {}

  async login(user: any): Promise<any> {
    if (user === undefined) {
      throw new InternalServerErrorException('Failed to login.')
    }

    return user
  }

  async authMe(sessionId: string, user: User): Promise<AuthMeUser> {
    const session = await this.sessionRepository.findSessionById(sessionId)

    return {
      ...user,
      needTwoFA: session.needTwoFA,
    }
  }

  async validateTwoFA(
    sessionId: string,
    user: User,
    token: string
  ): Promise<void> {
    const session = await this.sessionRepository.findSessionById(sessionId)

    if (!session) {
      throw new InternalServerErrorException('Session not found.')
    }

    if (!session.needTwoFA) {
      throw new InternalServerErrorException('2FA is not needed.')
    }

    const verified = speakeasy.totp.verify({
      secret: user.twoFASecret,
      encoding: 'base32',
      token,
    })

    if (!verified) {
      throw new InternalServerErrorException('Invalid token.')
    }

    await this.sessionRepository.updateSession({
      sid: sessionId,
      needTwoFA: false,
    })
  }

  async getQRCode(user: User): Promise<string> {
    if (!user.twoFASetting || !user.twoFASecret) {
      throw new InternalServerErrorException('2FA is not enabled.')
    }
    const otpauthURL = await speakeasy.otpauthURL({
      secret: user.twoFASecret,
      label: 'transcendence:' + user.username,
      encoding: 'base32',
    })
    return QRCode.toDataURL(otpauthURL)
  }
}
