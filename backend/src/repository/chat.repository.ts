import { HttpException, Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import {
  ChatRoom,
  Message,
  User,
  UserRole,
  Prisma,
  Session,
  UserRoleInChat,
  RoomType,
} from '@prisma/client'
import { Logger } from '@nestjs/common'

export type CreateMessageInput = {
  content: string
  timestamp: Date
  userId: number
  chatRoomId: number
}

export type MessageWithUser = {
  id: number
  content: string
  timestamp: Date
  user: User
  chatRoomId: number
}

export type ChatRoomWithOutPassword = {
  id: number
  roomName: string
  roomType: RoomType
  userRoles: {
    userId: number
    userRole: UserRole
  }[]
  userMuted: {
    userId: number
  }[]
  userBanned: {
    userId: number
  }[]
}

@Injectable()
export class ChatRepository {
  constructor(private readonly prisma: PrismaService) {}
  logger: Logger = new Logger('ChatRepository')

  async getUserById(userId: number): Promise<User> {
    return await this.prisma.user.findUnique({
      where: {
        id: userId,
      },
    })
  }

  async getUserList(): Promise<User[]> {
    return await this.prisma.user.findMany()
  }

  async getRoomListWithOutPassword(): Promise<ChatRoomWithOutPassword[]> {
    const result = await this.prisma.chatRoom
      .findMany({
        select: {
          id: true,
          roomName: true,
          roomType: true,
          userRoles: {
            select: {
              userId: true,
              userRole: true,
            },
          },
          userMuted: {
            select: {
              userId: true,
            },
          },
          userBanned: {
            select: {
              userId: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    return result
  }

  async getMyEnterRoomListByUserId(
    userId: number
  ): Promise<ChatRoomWithOutPassword[]> {
    // パブリックルームは全て取得し、プライベートルームとDMはUserRoleInChatに含まれているものだけ取得
    const publicRooms = await this.prisma.chatRoom.findMany({
      where: {
        roomType: RoomType.PUBLIC,
      },
      select: {
        id: true,
        roomName: true,
        roomType: true,
        userRoles: {
          select: {
            userId: true,
            userRole: true,
          },
        },
        userMuted: {
          select: {
            userId: true,
          },
        },
        userBanned: {
          select: {
            userId: true,
          },
        },
      },
    })
    const privateRooms = await this.prisma.chatRoom.findMany({
      where: {
        roomType: RoomType.PRIVATE,
        userRoles: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        roomName: true,
        roomType: true,
        userRoles: {
          select: {
            userId: true,
            userRole: true,
          },
        },
        userMuted: {
          select: {
            userId: true,
          },
        },
        userBanned: {
          select: {
            userId: true,
          },
        },
      },
    })
    const uniiquedPrivateRooms: { [key: number]: ChatRoomWithOutPassword } = {}
    privateRooms.forEach((items) => {
      uniiquedPrivateRooms[items.id] = items
    })

    const dmRooms = await this.prisma.chatRoom.findMany({
      where: {
        roomType: RoomType.DM,
        userRoles: {
          some: {
            userId: userId,
          },
        },
      },
      select: {
        id: true,
        roomName: true,
        roomType: true,
        userRoles: {
          select: {
            userId: true,
            userRole: true,
          },
        },
        userMuted: {
          select: {
            userId: true,
          },
        },
        userBanned: {
          select: {
            userId: true,
          },
        },
      },
    })
    const uniiquedDmRooms: { [key: number]: ChatRoomWithOutPassword } = {}
    dmRooms.forEach((items) => {
      uniiquedDmRooms[items.id] = items
    })

    const protectedRooms = await this.prisma.chatRoom.findMany({
      where: {
        roomType: RoomType.PASSWORD_PROTECTED,
      },
      select: {
        id: true,
        roomName: true,
        roomType: true,
        userRoles: {
          select: {
            userId: true,
            userRole: true,
          },
        },
        userMuted: {
          select: {
            userId: true,
          },
        },
        userBanned: {
          select: {
            userId: true,
          },
        },
      },
    })
    const uniiquedProtectedRooms: {
      [key: number]: ChatRoomWithOutPassword
    } = {}
    protectedRooms.forEach((items) => {
      uniiquedProtectedRooms[items.id] = items
    })

    const result = publicRooms.concat(
      Object.values(uniiquedPrivateRooms),
      Object.values(uniiquedDmRooms),
      Object.values(uniiquedProtectedRooms)
    )
    this.logger.debug('getMyEnterRoomListByUserId: ', result)
    return result
  }

  async getRoomMessageHistory(
    room: ChatRoomWithOutPassword
  ): Promise<MessageWithUser[]> {
    // chatRoomIdに基づいてchatMessageを取得し、ユーザー名を含めて返す
    return await this.prisma.message.findMany({
      where: {
        chatRoomId: room.id,
      },
      include: {
        user: true,
      },
    })
  }

  async getRoomByName(roomName: string): Promise<ChatRoom> {
    return await this.prisma.chatRoom.findUnique({
      where: {
        roomName: roomName,
      },
    })
  }

  async getRoomWithOutPasswordByName(
    roomName: string
  ): Promise<ChatRoomWithOutPassword> {
    const result = await this.prisma.chatRoom
      .findUnique({
        where: {
          roomName: roomName,
        },
        select: {
          id: true,
          roomName: true,
          roomType: true,
          userRoles: {
            select: {
              userId: true,
              userRole: true,
            },
          },
          userMuted: {
            select: {
              userId: true,
            },
          },
          userBanned: {
            select: {
              userId: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    return result
  }

  async getRoomById(roomId: number): Promise<ChatRoom> {
    return await this.prisma.chatRoom.findUnique({
      where: {
        id: roomId,
      },
    })
  }

  async getRoomWithPasswordById(
    roomId: number
  ): Promise<ChatRoomWithOutPassword> {
    const result = await this.prisma.chatRoom
      .findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
          roomName: true,
          roomType: true,
          userRoles: {
            select: {
              userId: true,
              userRole: true,
            },
          },
          userMuted: {
            select: {
              userId: true,
            },
          },
          userBanned: {
            select: {
              userId: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    return result
  }

  async getRoomWithOutPasswordById(
    roomId: number
  ): Promise<ChatRoomWithOutPassword> {
    const result = await this.prisma.chatRoom
      .findUnique({
        where: {
          id: roomId,
        },
        select: {
          id: true,
          roomName: true,
          roomType: true,
          userRoles: {
            select: {
              userId: true,
              userRole: true,
            },
          },
          userMuted: {
            select: {
              userId: true,
            },
          },
          userBanned: {
            select: {
              userId: true,
            },
          },
        },
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    return result
  }

  async wsCreateRoom(
    RoomData: Prisma.ChatRoomCreateInput,
    userId: number
  ): Promise<ChatRoomWithOutPassword> {
    const newRoom = await this.prisma.chatRoom
      .create({
        data: RoomData,
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    await this.prisma.userRoleInChat
      .createMany({
        data: [
          {
            userId: userId,
            chatRoomId: newRoom.id,
            userRole: UserRole.OWNER,
          },
          {
            userId: userId,
            chatRoomId: newRoom.id,
            userRole: UserRole.ADMIN,
          },
          {
            userId: userId,
            chatRoomId: newRoom.id,
            userRole: UserRole.USER,
          },
        ],
      })
      .catch((error) => {
        this.logger.error(error)
        throw new HttpException(error, 500)
      })
    if (newRoom.roomType === RoomType.DM) {
      const dmRoomNameList = newRoom.roomName.split('&')
      const [userId1, userId2] = dmRoomNameList.map((id) => parseInt(id))
      const taegetUserId = userId1 === userId ? userId2 : userId1
      await this.prisma.userRoleInChat.create({
        data: {
          userId: taegetUserId,
          chatRoomId: newRoom.id,
          userRole: UserRole.USER,
        },
      })
    }

    return this.prisma.chatRoom.findUnique({
      where: {
        id: newRoom.id,
      },
      select: {
        id: true,
        roomName: true,
        roomType: true,
        userRoles: {
          select: {
            userId: true,
            userRole: true,
          },
        },
        userMuted: {
          select: {
            userId: true,
          },
        },
        userBanned: {
          select: {
            userId: true,
          },
        },
      },
    })
  }

  async deleteRoom(room: ChatRoomWithOutPassword): Promise<void> {
    try {
      await this.prisma.userMutedInChat.deleteMany({
        where: {
          chatRoomId: room.id,
        },
      })
      await this.prisma.userBannedInChat.deleteMany({
        where: {
          chatRoomId: room.id,
        },
      })
      await this.prisma.message.deleteMany({
        where: {
          chatRoomId: room.id,
        },
      })
      await this.prisma.userRoleInChat.deleteMany({
        where: {
          chatRoomId: room.id,
        },
      })

      await this.prisma.chatRoom.delete({
        where: {
          id: room.id,
        },
      })
    } catch (error) {
      console.error('Error deleting room:', error)
      // You might want to throw the error after logging it to handle it at a higher level
      throw error
    }
  }

  async createMessage(message: CreateMessageInput): Promise<Message> {
    // 必要な情報が揃ったので、DBに保存
    return await this.prisma.message.create({
      data: {
        content: message.content,
        timestamp: message.timestamp,
        user: {
          connect: {
            id: message.userId,
          },
        },
        chatRoom: {
          connect: {
            id: message.chatRoomId,
          },
        },
      },
    })
  }

  async isMuted(
    userId: number,
    room: ChatRoomWithOutPassword
  ): Promise<boolean> {
    // ユーザーIDとルームIDを使って、UserMuteedInChatに含まれているかどうかを確認
    const mutedUser = await this.prisma.userMutedInChat.findFirst({
      where: {
        userId: userId,
        chatRoomId: room.id,
      },
    })
    return mutedUser !== null
  }

  async isBanned(
    userId: number,
    room: ChatRoomWithOutPassword
  ): Promise<boolean> {
    // ユーザーIDとルームIDを使って、UserBannedInChatに含まれているかどうかを確認
    const bannedUser = await this.prisma.userBannedInChat.findFirst({
      where: {
        userId: userId,
        chatRoomId: room.id,
      },
    })
    this.logger.debug('isBanned bannedUser : ' + bannedUser)
    this.logger.debug('isBanned bannedUser !== null : ' + (bannedUser !== null))
    return bannedUser !== null
  }

  async isJoined(
    userId: number,
    room: ChatRoomWithOutPassword
  ): Promise<boolean> {
    const userRoleInChat = await this.prisma.userRoleInChat.findFirst({
      where: {
        userId: userId,
        chatRoomId: room.id,
      },
    })
    this.logger.log('isJoined: ', Boolean(userRoleInChat))
    return userRoleInChat !== null
  }

  async joinDbRoom(userId: number, roomId: number): Promise<void> {
    // ユーザーIDとルームIDを使って、UserRoleInChatに追加

    await this.prisma.userRoleInChat
      .create({
        data: {
          userId: userId,
          chatRoomId: roomId,
          userRole: UserRole.USER, // 一般ユーザーとして追加
        },
      })
      .catch((error) => {
        this.logger.error(error)
        // throw new HttpException(error, 500)
      })
  }

  async leaveDbRoom(userId: number, roomId: number): Promise<void> {
    // ユーザーIDとルームIDを使って、UserRoleInChatから削除UserMuteedInChatとUserBannedInChatの情報は残す
    this.logger.debug('leaveDbRoom: ' + userId + ' ' + roomId)
    const log = await this.prisma.userRoleInChat.deleteMany({
      where: {
        userId: userId,
        chatRoomId: roomId,
      },
    })
    this.logger.debug('leaveDbRoom: ' + log)
  }

  async getSessionByUserId(userId: number): Promise<Session> {
    return await this.prisma.session.findFirst({
      where: {
        userId: userId,
      },
    })
  }

  async getUserRolesInChatByUserIdAndChatRoomIdFindMany(
    userId: number,
    chatRoomId: number
  ): Promise<UserRoleInChat[]> {
    const userRoleInChat = await this.prisma.userRoleInChat.findMany({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
    return userRoleInChat
  }

  async getUsreRoleInChatByUserIdAndChatRoomIdFindFirst(
    userId: number,
    chatRoomId: number
  ): Promise<UserRoleInChat> {
    const userRoleInChat = await this.prisma.userRoleInChat.findFirst({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
    return userRoleInChat
  }

  async addUserRole(
    userId: number,
    chatRoomId: number,
    userRole: UserRole
  ): Promise<void> {
    await this.prisma.userRoleInChat.create({
      data: {
        userId: userId,
        chatRoomId: chatRoomId,
        userRole: userRole,
      },
    })
  }

  async removeUserRole(
    userId: number,
    chatRoomId: number,
    userRole: UserRole
  ): Promise<void> {
    await this.prisma.userRoleInChat.deleteMany({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
        userRole: userRole,
      },
    })
  }

  async addBannedUser(userId: number, chatRoomId: number): Promise<void> {
    await this.prisma.userBannedInChat.create({
      data: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
  }

  async removeBannedUser(userId: number, chatRoomId: number): Promise<void> {
    await this.prisma.userBannedInChat.deleteMany({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
  }

  async addMutedUser(userId: number, chatRoomId: number): Promise<void> {
    await this.prisma.userMutedInChat.create({
      data: {
        userId: userId,
        chatRoomId: chatRoomId,
        mutedUntil: new Date(Date.now() + 1000 * 60 * 60 * 24 * 7), // 7日後
      },
    })
  }

  async removeMutedUser(userId: number, chatRoomId: number): Promise<void> {
    await this.prisma.userMutedInChat.deleteMany({
      where: {
        userId: userId,
        chatRoomId: chatRoomId,
      },
    })
  }

  async setRoomPassword(
    room: ChatRoomWithOutPassword,
    password: string
  ): Promise<void> {
    if (password === '') {
      // この場合は、パスワードを削除し、ルームTypeをパブリックに変更
      this.logger.debug('setRoomPassword: ' + room.id + ' ' + password)
      this.logger.debug('Public Roomに変更')
      await this.prisma.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          roomType: RoomType.PUBLIC,
          roomPassword: undefined,
        },
      })
    }
    // 対象のルームがパスワード付きルームか
    if (room.roomType !== RoomType.PASSWORD_PROTECTED) {
      // そうでなければ、ルームTypeをパスワード付きルームに変更した上で、パスワードを設定
      await this.prisma.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          roomType: RoomType.PASSWORD_PROTECTED,
          roomPassword: password,
        },
      })
    } else {
      // そうでなければ、パスワードを設定
      await this.prisma.chatRoom.update({
        where: {
          id: room.id,
        },
        data: {
          roomPassword: password,
        },
      })
    }
  }

  async getMessageById(massageId: number): Promise<Message> {
    return await this.prisma.message.findUnique({
      where: {
        id: massageId,
      },
    })
  }
}

export default ChatRepository
