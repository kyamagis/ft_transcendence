import { Injectable } from '@nestjs/common'
import {
  UserSearchRepository,
  UserIdAndUsername,
} from '@/user-search/user-search.repository'
import { Logger } from '@nestjs/common'

@Injectable()
export class UserSearchService {
  constructor(private readonly userSearchRepository: UserSearchRepository) {}
  private readonly logger = new Logger(UserSearchService.name)

  async userSearch(query: string): Promise<UserIdAndUsername[]> {
    return await this.userSearchRepository.searchUser(query)
  }
}
