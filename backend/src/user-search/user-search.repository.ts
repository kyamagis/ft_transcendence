import { Injectable, Logger } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'

export type UserIdAndUsername = {
  id: number
  username: string
}

@Injectable()
export class UserSearchRepository {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserSearchRepository.name)

  async searchUser(query: string): Promise<UserIdAndUsername[]> {
    if (query === '') return []
    const users = await this.prisma.user.findMany({
      where: {
        username: {
          startsWith: query,
          mode: 'insensitive', // 大文字小文字を区別しない PostgreSQL でのみ動作するので注意
        },
      },
      select: {
        id: true,
        username: true,
      },
    })
    this.logger.debug(users)
    return users
  }
}
