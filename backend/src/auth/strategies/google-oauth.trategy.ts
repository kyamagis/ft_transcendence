import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import { Strategy, Profile } from 'passport-google-oauth20'
import {
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  GOOGLE_AUTH_CALLBACK_URL,
} from '@/config'

import { UserRepository } from '@/user/user.repository'
import ValidateUser from '../types/validate.user.interface'
import { GoogleAccountRepository } from '@/repository/google-account.repository'

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google-oauth') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly googleAccountRepository: GoogleAccountRepository
  ) {
    super({
      clientID: GOOGLE_CLIENT_ID,
      clientSecret: GOOGLE_SECRET,
      callbackURL: GOOGLE_AUTH_CALLBACK_URL,
      scope: ['email'],
      accessType: 'offline',
    })
  }

  // ここでaccessTokenの検証と、GoogleUserとBackendUserの突合を行う
  // 存在しない場合は新しく作成する
  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile
  ): Promise<ValidateUser> {
    try {
      const { emails } = profile
      const email = emails[0].value
      // emailがgoogleAccountに存在する場合、そのidを返す
      const existingGoogleAccount =
        await this.googleAccountRepository.findGoogleAccountByEmail(email)
      if (existingGoogleAccount) {
        const existingUser = await this.userRepository.findUserById(
          existingGoogleAccount.userId
        )
        return {
          id: existingUser.id,
          twoFASetting: existingUser.twoFASetting,
        }
      }

      // userData.idが存在しない場合、userとftAccountを作成する
      const newUser = await this.userRepository.createUser({})

      const newFtAccount = await this.googleAccountRepository.createGoogleUser({
        email: email,
        user: { connect: { id: newUser.id } },
      })

      return { id: newUser.id, twoFASetting: newUser.twoFASetting }
    } catch (error) {
      console.error(error)
      throw new Error('Validation failed')
    }
  }
}
