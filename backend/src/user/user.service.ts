import { LadderLevel } from './../pong/execPong/enums/index'
import * as speakeasy from 'speakeasy'
import { UserRepository } from '@/user/user.repository'
import { Prisma } from '@prisma/client'
import { HttpException, HttpStatus, Injectable } from '@nestjs/common'
import convertFromPointsToLevels from '@/pong/laddermatch/convertFromPointsToLevels'

@Injectable()
export class UserService {
  constructor(private readonly userRepository: UserRepository) {}

  findUserById(id: number) {
    return this.userRepository.findUserById(id)
  }

  async updateUserProfile(id: number, updateData: Prisma.UserUpdateInput) {
    const user = await this.userRepository.findUserById(id)

    if (!user) {
      throw new HttpException('user not found', HttpStatus.PRECONDITION_FAILED)
    }

    // 2段階認証が有効になる場合は、secretを生成する
    if (updateData.twoFASetting && user.twoFASecret === null) {
      const secret = speakeasy.generateSecret({ length: 20 })
      const updateDataWithSecret = {
        ...updateData,
        twoFASecret: secret.base32,
      }
      return this.userRepository.updateUser(id, updateDataWithSecret)
    } else {
      return this.userRepository.updateUser(id, updateData)
    }
  }

  getRole(userId: number, chatRoomId: number) {
    return this.userRepository.getRole(userId, chatRoomId)
  }

  getAdmins(roomId: number) {
    return this.userRepository.getAdmins(roomId)
  }

  getMutedOrBannedUsers(roomId: number, type: 'MUTE' | 'BAN') {
    return this.userRepository.getMutedOrBannedUsers(roomId, type)
  }

  async findMatchRecordByUserId(userId: number) {
    const matchRecord =
      await this.userRepository.findMatchRecordByUserId(userId)

    if (!matchRecord) {
      throw new HttpException('match record not found', HttpStatus.NOT_FOUND)
    }

    const ladderEnum = convertFromPointsToLevels(matchRecord.ladderpoints)

    return {
      ...matchRecord,
      ladderRank: LadderLevel[ladderEnum],
    }
  }
}
