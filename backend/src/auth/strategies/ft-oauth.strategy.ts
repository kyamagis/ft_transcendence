import { Injectable } from '@nestjs/common'

import { PassportStrategy } from '@nestjs/passport'
import { Strategy as OAuth2Strategy } from 'passport-oauth2'
import {
  FT_API_UID,
  FT_API_SECRET,
  FT_API_DOMAIN,
  FT_AUTH_CALLBACK_URL,
} from '@/config'
import axios from 'axios'

import { UserRepository } from '@/user/user.repository'
import { FtAccountRepository } from '@/repository/ft-account.repository'
import ValidateUser from '../types/validate.user.interface'

@Injectable()
export class FtStrategy extends PassportStrategy(OAuth2Strategy, 'ft-oauth') {
  constructor(
    private readonly userRepository: UserRepository,
    private readonly ftAccountRepository: FtAccountRepository
  ) {
    super({
      authorizationURL: `${FT_API_DOMAIN}/oauth/authorize`,
      tokenURL: `${FT_API_DOMAIN}/oauth/token`,
      clientID: FT_API_UID,
      clientSecret: FT_API_SECRET,
      callbackURL: FT_AUTH_CALLBACK_URL,
      scope: ['public'],
      state: true,
    })
  }

  // ここでaccessTokenの検証と、42UserとBackendUserの突合を行う
  // 存在しない場合は新しく作成する
  async validate(accessToken: string): Promise<ValidateUser> {
    // curl  -H "Authorization: Bearer YOUR_ACCESS_TOKEN" "https://api.intra.42.fr/v2/me"
    try {
      const response = await axios.get(`${FT_API_DOMAIN}/v2/me`, {
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Access-Control-Allow-Origin': 'http://localhost:5000',
        },
      })

      const ftUser = response.data
      // userData.idがftAccountに存在する場合、そのidを返す
      const existingFtAccount =
        await this.ftAccountRepository.findFtAccountByFtId(ftUser.id.toString())
      if (existingFtAccount) {
        const existingUser = await this.userRepository.findUserById(
          existingFtAccount.userId
        )
        return {
          id: existingUser.id,
          twoFASetting: existingUser.twoFASetting,
        }
      }

      // userData.idが存在しない場合、userとftAccountを作成する
      const newUser = await this.userRepository.createUser({})

      const newFtAccount = await this.ftAccountRepository.createFtUser({
        ftId: ftUser.id.toString(),
        user: { connect: { id: newUser.id } },
      })

      return { id: newUser.id, twoFASetting: newUser.twoFASetting }
    } catch (error) {
      console.error(error)
      throw new Error('Validation failed')
    }
  }
}
