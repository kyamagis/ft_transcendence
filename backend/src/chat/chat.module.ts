import { Module } from '@nestjs/common'
import { ChatGateway } from './chat.gateway'
import { PrismaService } from '@/prisma/prisma.service'
import { ChatRepository } from '@/repository/chat.repository'

@Module({
  providers: [ChatGateway, ChatRepository, PrismaService],
  exports: [ChatGateway],
})
export class ChatModule {}
