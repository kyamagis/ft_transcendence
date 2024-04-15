import { Injectable, Logger } from '@nestjs/common'
import { CreateMessageDto } from './dto/create-message.dto'
import {
  CreateInvitationMessageInput,
  MessageRepository,
} from './message.repository'
import ChatRepository, {
  ChatRoomWithOutPassword,
  MessageWithUser,
} from '@/repository/chat.repository'
import { Prisma, RoomType, UserRole } from '@prisma/client'
import { UserRepository } from '@/user/user.repository'
import { ChatGateway } from '@/chat/chat.gateway'

@Injectable()
export class MessageService {
  constructor(
    private readonly messageRepo: MessageRepository,
    private readonly chatRepo: ChatRepository,
    private readonly userRepo: UserRepository,
    private readonly chatGate: ChatGateway
  ) {}

  private readonly logger = new Logger(MessageService.name)

  async create(
    createMessageDto: CreateMessageDto
  ): Promise<ChatRoomWithOutPassword> {
    const dmChatRoom = await this.messageRepo
      .hasDmChatRoomById(
        createMessageDto.myUserId,
        createMessageDto.opponentUserId
      )
      .catch((error) => {
        console.debug(error)
        return
      })
    const messageInput: CreateInvitationMessageInput = {
      content: 'Latter Of Invitonal Match',
      timestamp: new Date(),
      userId: createMessageDto.myUserId,
      chatRoomId: -1,
      gameParametersJson: createMessageDto.gameParametersJson,
    }

    const opponentUser = await this.userRepo.findUserById(
      createMessageDto.opponentUserId
    )

    if (dmChatRoom) {
      messageInput.chatRoomId = dmChatRoom.id
      const newMessage =
        await this.messageRepo.createInvitationMessage(messageInput)
      const user = await this.userRepo.findUserById(createMessageDto.myUserId)
      const messageWithUser: MessageWithUser = {
        ...newMessage,
        user,
      }
      this.chatGate.server
        .to(messageWithUser.chatRoomId.toString())
        .emit('receive_message', messageWithUser)

      dmChatRoom.roomName = opponentUser.username
      return dmChatRoom
    } else {
      const chatRoomCreateInput: Prisma.ChatRoomCreateInput = {
        roomName:
          createMessageDto.myUserId + '&' + createMessageDto.opponentUserId,
        roomType: RoomType.DM,
      }
      const roomInfo = await this.chatRepo.wsCreateRoom(
        chatRoomCreateInput,
        createMessageDto.myUserId
      )
      messageInput.chatRoomId = roomInfo.id
      const newMessage =
        await this.messageRepo.createInvitationMessage(messageInput)

      const user = await this.userRepo.findUserById(createMessageDto.myUserId)

      const messageWithUser: MessageWithUser = {
        ...newMessage,
        user,
      }

      this.chatGate.server.to(messageWithUser.chatRoomId.toString())

      roomInfo.roomName = opponentUser.username
      return roomInfo
    }
  }

  async deleteGameParametersJson(messageId: number) {
    return await this.messageRepo.deleteGameParametersJson(messageId)
  }
}
