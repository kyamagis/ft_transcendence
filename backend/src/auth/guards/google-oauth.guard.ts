import { SessionRepository } from '@/repository/session.repository'
import { UserRepository } from '@/user/user.repository'
import { Injectable, ExecutionContext } from '@nestjs/common'
import { AuthGuard } from '@nestjs/passport'
import ValidateUser from '../types/validate.user.interface'

@Injectable()
export class GoogleOauthGuard extends AuthGuard('google-oauth') {
  constructor(
    private sessionRepository: SessionRepository,
    private userRepository: UserRepository
  ) {
    super()
  }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    // requestにstrategyが設定され、認証が実行される
    // /authにリクエストがあった場合はPassport.OAuth2StrategyによりOauthにリダイレクトされる
    const authResult = (await super.canActivate(context)) as boolean

    // HTTP、WebSocket、GraphQL、Microservicesなどに共通なインターフェースとする
    const request = context.switchToHttp().getRequest()

    // Passportの認証が成功した後、ユーザーオブジェクトはrequest.userに格納
    const validatedUser: ValidateUser = request.user

    if (!validatedUser) {
      return false
    }

    // PassportのlogInメソッドを呼び出す前に、ユーザーIDをセッションに追加
    request.session.userId = validatedUser.id

    // passportがsessionを作成する
    await super.logIn(request)
    const sessionId = request.sessionID

    // SessionテーブルでuserId, twoFASettingを初期化
    await this.sessionRepository.updateSession({
      sid: sessionId,
      needTwoFA: validatedUser.twoFASetting,
      user: {
        connect: {
          id: validatedUser.id,
        },
      },
    })

    return true
  }
}
