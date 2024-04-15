import { TwoFAGuard } from '@/auth/guards/2fa.guard'
import {
  Controller,
  Get,
  Put,
  Body,
  ParseIntPipe,
  UseGuards,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common'
import { UserService } from './user.service'
import { SessionGuard } from '@/auth/guards/session.guard'
import { Param } from '@nestjs/common'
import { UpdateUserDto } from './types/udpate.user.dto'
import { MatchUserIdGuard } from './guards/match.userId.guard'
import { FileInterceptor } from '@nestjs/platform-express'
import { Logger } from '@nestjs/common'

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}
  private readonly logger = new Logger(UserController.name)

  @Get(':id')
  @UseGuards(SessionGuard, TwoFAGuard)
  getUserById(@Param('id', ParseIntPipe) id: number) {
    return this.userService.findUserById(id)
  }

  @Put(':id')
  @UseGuards(SessionGuard, TwoFAGuard, MatchUserIdGuard)
  @UseInterceptors(FileInterceptor('avatar'))
  updateUserProfile(
    @Param('id', ParseIntPipe) id: number,
    @Body() updateDto: UpdateUserDto,
    @UploadedFile() avatar: Express.Multer.File
  ) {
    const updateData: any = {
      ...updateDto,
    }
    this.logger.debug('updateUserProfile: ' + id + ' ' + updateData)
    // twoFASetting を boolean に変換
    if (updateDto.twoFASetting !== undefined) {
      updateData.twoFASetting = updateDto.twoFASetting === 'true'
    }
    if (avatar) {
      updateData.avatar = avatar.buffer
    }

    return this.userService.updateUserProfile(id, updateData)
  }

  @Get('get-role/:id')
  @UseGuards(SessionGuard, TwoFAGuard)
  getRole(
    @Param('userId', ParseIntPipe) userId: number,
    @Param('chatRoomId') chatRoomId: number
  ) {
    this.logger.debug('getRole: ' + userId + ' ' + chatRoomId)
    return this.userService.getRole(userId, chatRoomId)
  }

  @Get('admins/:roomId')
  @UseGuards(SessionGuard, TwoFAGuard)
  getAdmins(@Param('roomId', ParseIntPipe) roomId: number) {
    this.logger.debug('getAdmins: ' + roomId)
    return this.userService.getAdmins(roomId)
  }

  @Get('bans/:roomId')
  @UseGuards(SessionGuard, TwoFAGuard)
  getBans(@Param('roomId', ParseIntPipe) roomId: number) {
    this.logger.debug('getBans: ' + roomId)
    return this.userService.getMutedOrBannedUsers(roomId, 'BAN')
  }

  @Get('mutes/:roomId')
  @UseGuards(SessionGuard, TwoFAGuard)
  getMutes(@Param('roomId', ParseIntPipe) roomId: number) {
    this.logger.debug('getMutes: ' + roomId)
    return this.userService.getMutedOrBannedUsers(roomId, 'MUTE')
  }

  @Get('match/:userId')
  @UseGuards(SessionGuard, TwoFAGuard)
  findMatchRecordByUserId(@Param('userId', ParseIntPipe) userId: number) {
    this.logger.debug('findMatchRecordByUserId: ' + userId)
    return this.userService.findMatchRecordByUserId(userId)
  }
}
