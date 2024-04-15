import { SessionRepository } from '@/repository/session.repository'
import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common'

@Injectable()
export class TwoFAGuard implements CanActivate {
  constructor(private sessionRepository: SessionRepository) {}

  async canActivate(context: ExecutionContext) {
    const request = context.switchToHttp().getRequest()

    const session = await this.sessionRepository.findSessionById(
      request.session.id
    )

    return session ? !session.needTwoFA : false
  }
}
