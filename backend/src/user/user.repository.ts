import { HttpException, HttpStatus, Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { User, Prisma, UserRole } from '@prisma/client'

@Injectable()
export class UserRepository {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserRepository.name)

  private handleNotFound(entity: string) {
    throw new HttpException(`${entity} not found`, HttpStatus.NOT_FOUND)
  }

  private handleAlreadyExists(entity: string) {
    throw new HttpException(`${entity} already exists`, HttpStatus.CONFLICT)
  }

  async findUserById(userId: number) {
    const user = await this.prisma.user.findUnique({
      where: { id: userId },
    })
    if (!user) {
      this.handleNotFound('user')
    }
    return user
  }

  async createUser(userData: Prisma.UserCreateInput): Promise<User> {
    const user = await this.prisma.user.create({
      data: userData,
    })
    if (!user) {
      this.handleAlreadyExists('user')
    }
    return user
  }

  async updateUser(
    id: number,
    userData: Prisma.UserUpdateInput
  ): Promise<User> {
    // 重複チェック
    if (typeof userData.username === 'string') {
      const user = await this.prisma.user.findUnique({
        where: { username: userData.username },
      })
      if (user && user.id !== id) {
        this.handleAlreadyExists('username')
      }
    }

    return await this.prisma.user.update({
      where: { id: id },
      data: userData,
    })
  }

  async getRole(userId: number, chatRoomId: number): Promise<UserRole> {
    const roleInChat = await this.prisma.userRoleInChat.findFirst({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
    return roleInChat.userRole
  }

  async getAdmins(roomId: number): Promise<User[]> {
    // まず指定のルームの管理者ロールを取得
    const admins = await this.prisma.userRoleInChat.findMany({
      where: {
        chatRoomId: roomId,
        userRole: UserRole.ADMIN,
      },
      include: {
        user: true,
      },
    })
    return admins.map((admin) => admin.user)
  }

  async getMutedOrBannedUsers(
    roomId: number,
    type: 'MUTE' | 'BAN'
  ): Promise<User[]> {
    if (type === 'BAN') {
      const bannedUsers = await this.prisma.userBannedInChat.findMany({
        where: {
          chatRoomId: roomId,
        },
        include: {
          user: true,
        },
      })
      this.logger.debug('BAN users: ', bannedUsers)
      return bannedUsers.map((bannedUser) => bannedUser.user)
    } else if (type === 'MUTE') {
      const mutedUsers = await this.prisma.userMutedInChat.findMany({
        where: {
          chatRoomId: roomId,
        },
        include: {
          user: true,
        },
      })
      this.logger.debug('MUTE users: ', mutedUsers)
      return mutedUsers.map((mutedUser) => mutedUser.user)
    }
  }

  async findMatchRecordByUserId(userId: number) {
    const matchRecord = await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
      select: {
        id: true,
        username: true,
        ladderpoints: true,
        matchrecords: true,
      },
    })
    if (!matchRecord) {
      this.handleNotFound('user')
    }

    return matchRecord
  }
}
