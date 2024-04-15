import { Test, TestingModule } from '@nestjs/testing'
import { UserSearchService } from './user-search.service'
import { UserSearchRepository } from '@/user-search/user-search.repository'

// モック用のUserSearchRepository
class MockUserSearchRepository {
  async searchUser(query: string) {
    return [{ id: 1, username: 'Alice' }]
  }
}

/* 
このサービスはリポジトリ層に対して透過性を有するため、テストの対象は限られる。
したがって、ここでは、透過性の証明として、リポジトリ層のモックを作成したうえで、
リポジトリ層の結果がそのままサービス層に返されることを確認し、
サービス層が受け取った引数をそのままリポジトリ層に渡していることを確認する。
*/

describe('UserSearchService', () => {
  let service: UserSearchService
  let mockRepository: MockUserSearchRepository

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserSearchService,
        { provide: UserSearchRepository, useClass: MockUserSearchRepository }, // モックを注入
      ],
    }).compile()

    service = module.get<UserSearchService>(UserSearchService)
    mockRepository = module.get<UserSearchRepository>(UserSearchRepository)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should return users from the repository', async () => {
    const result = await service.userSearch('some query')
    expect(result).toEqual([{ id: 1, username: 'Alice' }])
  })

  it('should call the repository with the query', async () => {
    const spy = jest.spyOn(mockRepository, 'searchUser')
    await service.userSearch('some query')
    expect(spy).toBeCalledWith('some query')
  })
})
