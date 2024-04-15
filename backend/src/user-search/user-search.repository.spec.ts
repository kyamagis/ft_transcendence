import { Test, TestingModule } from '@nestjs/testing'
import { UserSearchRepository } from './user-search.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { execSync } from 'child_process'

describe('UserSearchRepository', () => {
  let repository: UserSearchRepository
  let prisma: PrismaService

  beforeEach(async () => {
    // データベースのリセットとシード
    execSync('npx prisma migrate reset --force')
    execSync('npx prisma db seed', { stdio: 'inherit' })

    const module: TestingModule = await Test.createTestingModule({
      providers: [UserSearchRepository, PrismaService],
    }).compile()

    repository = module.get<UserSearchRepository>(UserSearchRepository)
    prisma = module.get<PrismaService>(PrismaService)
  })

  it('should return a list of users for single character query', async () => {
    const result = [{ id: 6, username: 'nfukuma' }]
    expect(await repository.searchUser('n')).toEqual(result)
  })

  it('should return an empty array if no users match the query', async () => {
    expect(await repository.searchUser('z')).toEqual([])
  })

  it('should return a list of users matching the query regardless of case', async () => {
    const result = [{ id: 6, username: 'nfukuma' }]
    expect(await repository.searchUser('N')).toEqual(result)
  })

  it('should return a list of users matching the query for multi-character queries', async () => {
    const result = [{ id: 6, username: 'nfukuma' }]
    expect(await repository.searchUser('nf')).toEqual(result)
  })

  it('should return a list of users matching the query for full username queries', async () => {
    const result = [{ id: 6, username: 'nfukuma' }]
    expect(await repository.searchUser('nfukuma')).toEqual(result)
  })
})
