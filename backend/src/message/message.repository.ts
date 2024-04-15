import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Logger } from '@nestjs/common'
import { ChatRoom, Message, RoomType } from '@prisma/client'
import { ChatRoomWithOutPassword } from '@/repository/chat.repository'

export type CreateInvitationMessageInput = {
  content: string
  timestamp: Date
  userId: number
  chatRoomId: number
  gameParametersJson: string | undefined
}

@Injectable()
export class MessageRepository {
  constructor(private readonly prisma: PrismaService) {}
  logger: Logger = new Logger('message')

  async createInvitationMessage(
    messageInput: CreateInvitationMessageInput
  ): Promise<Message> {
    const messageData: any = {
      content: messageInput.content,
      timestamp: messageInput.timestamp,
      user: {
        connect: {
          id: messageInput.userId,
        },
      },
      chatRoom: {
        connect: {
          id: messageInput.chatRoomId,
        },
      },
    }

    if (messageInput.gameParametersJson !== undefined) {
      messageData.gameParametersJson = messageInput.gameParametersJson
    }

    this.logger.debug('Message data: ' + JSON.stringify(messageData))
    return await this.prisma.message.create({
      data: messageData,
    })
  }

  async hasDmChatRoomById(
    myUserId: number,
    opponentUserId: number
  ): Promise<ChatRoomWithOutPassword | undefined> {
    const dmChatRooms = await this.prisma.chatRoom.findMany({
      where: {
        roomType: RoomType.DM,
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

    // Step 2: Check each DM room to see if the specified users are in the room
    for (const room of dmChatRooms) {
      const userRoles = await this.prisma.userRoleInChat.findMany({
        where: {
          chatRoomId: room.id,
          userId: {
            in: [myUserId, opponentUserId],
          },
        },
      })

      // Check if both users are in the room
      const userIdsInRoom = userRoles.map((room) => room.userId)
      if (
        userIdsInRoom.includes(myUserId) &&
        userIdsInRoom.includes(opponentUserId)
      ) {
        console.log(room)
        return room
      }
    }
    return undefined
  }

  async deleteGameParametersJson(messageId: number) {
    console.log(messageId)
    return await this.prisma.message.update({
      where: {
        id: messageId,
      },
      data: {
        gameParametersJson: null,
      },
    })
  }
}
