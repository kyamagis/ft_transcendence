import {
  Controller,
  Get,
  Post,
  Req,
  Res,
  UseGuards,
  Redirect,
  HttpException,
  HttpStatus,
} from '@nestjs/common'
import { AuthService } from './auth.service'
import { FtOauthGuard } from './guards/ft-oauth.guard'
import { SessionGuard } from './guards/session.guard'
import * as express from 'express'
import { GoogleOauthGuard } from './guards/google-oauth.guard'

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Get('/ft-oauth')
  @UseGuards(FtOauthGuard)
  ftOauth() {
    // redirect先でsession作成を行うので、ここでは何もしない
  }

  @Get('/ft-oauth/redirect')
  @UseGuards(FtOauthGuard)
  @Redirect('http://localhost:5000', 302)
  ftRedirect(@Req() req) {
    return this.authService.login(req?.user)
  }

  @Get('/google-oauth')
  @UseGuards(GoogleOauthGuard)
  googleOauth() {
    // redirect先でsession作成を行うので、ここでは何もしない
  }

  @Get('/google-oauth/redirect')
  @UseGuards(GoogleOauthGuard)
  @Redirect('http://localhost:5000', 302)
  googleRedirect(@Req() req) {
    return this.authService.login(req?.user)
  }

  @UseGuards(SessionGuard)
  @Get('/me')
  authMe(@Req() req) {
    const sessionId = req.session.id
    if (!sessionId) {
      throw new HttpException('Session not found', HttpStatus.UNAUTHORIZED)
    }
    return this.authService.authMe(sessionId, req.user)
  }

  @UseGuards(SessionGuard)
  @Get('/logout')
  async logout(
    @Req() req: express.Request,
    @Res() res: express.Response
  ): Promise<void> {
    req.session.destroy((err) => {
      if (err) {
        console.error(err)
        throw new HttpException(
          'Logout failed',
          HttpStatus.INTERNAL_SERVER_ERROR
        )
      }

      // セッションクッキーをクリア
      res.clearCookie('connect.sid')

      // トップページにリダイレクト
      res.redirect('/')
    })
  }

  @UseGuards(SessionGuard)
  @Post('/2fa/validate')
  async validateTwoFA(@Req() req) {
    const sessionId = req.session.id
    if (!sessionId) {
      throw new HttpException('Session not found', HttpStatus.UNAUTHORIZED)
    }
    const token = req.body.token
    if (!token) {
      throw new HttpException('Token not found', HttpStatus.BAD_REQUEST)
    }
    return this.authService.validateTwoFA(sessionId, req.user, token)
  }

  @UseGuards(SessionGuard)
  @Get('/2fa/qr')
  async getQRCode(@Req() req) {
    return this.authService.getQRCode(req.user)
  }
}
