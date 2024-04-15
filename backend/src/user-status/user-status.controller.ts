import { Controller, ParseIntPipe, UseGuards } from '@nestjs/common'
import { UserStatusService } from './user-status.service'
import { Get, Param } from '@nestjs/common'
import { Status } from './user-status.service'
import { Logger } from '@nestjs/common'
import { SessionGuard } from '@/auth/guards/session.guard'
import { TwoFAGuard } from '@/auth/guards/2fa.guard'

@Controller('user-status')
export class UserStatusController {
  private log = new Logger('UserStatusController')
  constructor(private readonly userStatusService: UserStatusService) {}

  // TODO: このuserIDがセッションのuserIDと一致するかどうかのチェックを入れる
  @Get(':id')
  @UseGuards(SessionGuard, TwoFAGuard)
  fetchFriendStatus(@Param('id', ParseIntPipe) id: number): Status {
    this.log.debug(`fetchFriendStatus: ${id}`)
    return this.userStatusService.fetchFriendStatus(id)
  }

  @Get(':id/:status')
  @UseGuards(SessionGuard, TwoFAGuard)
  setStatus(
    @Param('id', ParseIntPipe) id: number,
    @Param('status') status: Status
  ): void {
    this.log.debug(`setStatus: ${id}, ${status}`)
    this.userStatusService.setStatus(id, status)
  }
}
