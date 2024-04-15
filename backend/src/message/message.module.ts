import { Module } from '@nestjs/common'
import { MessageService } from './message.service'
import { MessageController } from './message.controller'
import { MessageRepository } from './message.repository'
import { PrismaService } from '@/prisma/prisma.service'
import ChatRepository from '@/repository/chat.repository'
import { UserRepository } from '@/user/user.repository'
import { ChatModule } from '@/chat/chat.module'

@Module({
  imports: [ChatModule],
  controllers: [MessageController],
  providers: [
    MessageService,
    MessageRepository,
    ChatRepository,
    UserRepository,
    PrismaService,
  ],
})
export class MessageModule {}
