import { Test, TestingModule } from '@nestjs/testing'
import { UserStatusService, Status } from './user-status.service'

describe('UserStatusService', () => {
  let service: UserStatusService

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [UserStatusService],
    }).compile()

    service = module.get<UserStatusService>(UserStatusService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  it('should set status correctly', () => {
    service.setStatus(1, 'CHAT')
    expect(service.fetchFriendStatus(1)).toEqual('CHAT')

    service.setStatus(1, 'PONG')
    expect(service.fetchFriendStatus(1)).toEqual('PONG')

    service.setStatus(2, 'IDLE')
    expect(service.fetchFriendStatus(2)).toEqual('IDLE')
  })

  it('should return OFFLINE if user has no status set', () => {
    expect(service.fetchFriendStatus(3)).toEqual('OFFLINE')
  })

  it('should delete status correctly', () => {
    service.setStatus(4, 'CHAT')
    expect(service.fetchFriendStatus(4)).toEqual('CHAT')

    service.deleteStatus(4)
    expect(service.fetchFriendStatus(4)).toEqual('OFFLINE')
  })
})
