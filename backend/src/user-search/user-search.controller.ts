import { Controller, Get, Query, Req, Res, UseGuards } from '@nestjs/common'
import { UserSearchService } from './user-search.service'
import { SessionGuard } from '@/auth/guards/session.guard'
import { Logger } from '@nestjs/common'
import { TwoFAGuard } from '@/auth/guards/2fa.guard'
import { Request, Response } from 'express'
import { UserIdAndUsername } from '@/user-search/user-search.repository'

@Controller('user-search')
export class UserSearchController {
  constructor(private readonly userSearchService: UserSearchService) {}
  private readonly logger = new Logger(UserSearchController.name)

  @Get()
  @UseGuards(SessionGuard, TwoFAGuard)
  async userSearch(
    @Query('query') query: string,
    @Req() req: Request,
    @Res() res: Response
  ): Promise<void> {
    this.logger.debug(query)
    const result: UserIdAndUsername[] =
      await this.userSearchService.userSearch(query)
    res.setHeader('Content-Type', 'application/json')
    this.logger.debug(result)
    res.send(result)
  }
}
