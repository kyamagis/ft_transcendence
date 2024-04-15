// logging.middleware.ts
import { Injectable, NestMiddleware } from '@nestjs/common'
import { Request, Response, NextFunction } from 'express'
import { Logger } from '@nestjs/common'

@Injectable()
export class LoggingMiddleware implements NestMiddleware {
  private readonly logger = new Logger(LoggingMiddleware.name)
  use(req: Request, res: Response, next: NextFunction) {
    this.logger.debug('Headers:', req.headers)
    this.logger.debug('Body:', req.body)
    next()
  }
}
