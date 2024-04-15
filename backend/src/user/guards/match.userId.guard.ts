import {
  Injectable,
  CanActivate,
  ExecutionContext,
  ForbiddenException,
} from '@nestjs/common'

@Injectable()
export class MatchUserIdGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    const userId = request.user.id
    const paramId = Number(request.params.id)

    if (userId !== paramId) {
      throw new ForbiddenException(
        'You are not allowed to access this resource.'
      )
    }

    return true
  }
}
