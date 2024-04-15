// logging.guard.ts
import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common'
import { Logger } from '@nestjs/common'

@Injectable()
export class LoggingGuard implements CanActivate {
  private readonly logger = new Logger(LoggingGuard.name)
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest()
    this.logger.debug('Headers:', request.headers)
    return true // return false to deny access
  }
}
