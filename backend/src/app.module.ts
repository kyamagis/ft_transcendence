import { Module } from '@nestjs/common'
import { AppController } from './app.controller'
import { AppService } from './app.service'
import { AuthModule } from './auth/auth.module'
import { ChatModule } from './chat/chat.module'
import { PongModule } from './pong/pong.module'
import { UserModule } from './user/user.module'
import { UserStatusModule } from './user-status/user-status.module'
import { UserSearchModule } from './user-search/user-search.module'
import { LoggingMiddleware } from './logging/logging.middleware'
import { MiddlewareConsumer } from '@nestjs/common'
import { UserRelationModule } from './user-relation/user-relation.module'
import { MessageModule } from './message/message.module'

@Module({
  imports: [
    AuthModule,
    ChatModule,
    MessageModule,
    PongModule,
    UserModule,
    UserStatusModule,
    UserSearchModule,
    UserRelationModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {
  // configure(consumer: MiddlewareConsumer) {
  //   consumer.apply(LoggingMiddleware).forRoutes('*')
  // }
}
