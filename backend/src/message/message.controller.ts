import { Controller, Post, Body, Put } from '@nestjs/common'
import { MessageService } from './message.service'
import { CreateMessageDto } from './dto/create-message.dto'
import { UpdateMessageDto } from './dto/update-message.dto'

@Controller('message')
export class MessageController {
  constructor(private readonly messageService: MessageService) {}

  @Post()
  async create(@Body() createMessageDto: CreateMessageDto) {
    return await this.messageService.create(createMessageDto)
  }
  @Put()
  async update(@Body() updateMessageDto: UpdateMessageDto) {
    return await this.messageService.deleteGameParametersJson(
      updateMessageDto.messageId
    )
  }
}
