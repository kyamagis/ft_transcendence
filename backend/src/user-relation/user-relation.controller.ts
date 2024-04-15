import {
  Controller,
  Get,
  Post,
  Body,
  UseGuards,
  Param,
  ParseIntPipe,
} from '@nestjs/common'
import { UserRelationService } from './user-relation.service'
import { CreateUserRelationDto } from './dto/create-user-relation.dto'
import { RelationType } from '@prisma/client'
import { SessionGuard } from '@/auth/guards/session.guard'
import { TwoFAGuard } from '@/auth/guards/2fa.guard'
import { Logger } from '@nestjs/common'

enum Action {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

@Controller('user-relation')
export class UserRelationController {
  constructor(private readonly userRelationService: UserRelationService) {}
  private readonly logger = new Logger(UserRelationController.name)

  @Get('is-friend/:userId/:friendId')
  @UseGuards(SessionGuard, TwoFAGuard)
  isFriend(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('friendId', ParseIntPipe) friendId: number
  ) {
    return this.userRelationService.isFriend(userId, friendId)
  }

  @Get('relations/:id/:relationType')
  @UseGuards(SessionGuard, TwoFAGuard)
  getRelations(
    @Param('id', ParseIntPipe) id: number,
    @Param('relationType') relationType: RelationType
  ) {
    return this.userRelationService.getRelations(id, relationType)
  }

  @Post('manage-relation/:action')
  @UseGuards(SessionGuard, TwoFAGuard)
  manageRelation(
    @Body() createUserRelationDto: CreateUserRelationDto,
    @Param('action') action: Action
  ) {
    return this.userRelationService.manageRelation(
      createUserRelationDto,
      action
    )
  }
}
