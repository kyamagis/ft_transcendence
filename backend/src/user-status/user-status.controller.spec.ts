import { Test, TestingModule } from '@nestjs/testing'
import { UserStatusController } from './user-status.controller'
import { UserStatusService } from './user-status.service'
import { Status } from './user-status.service'

// UserStatusServiceのモック
const mockUserStatusService = {
  fetchFriendStatus: jest.fn(),
  setStatus: jest.fn(),
}

describe('UserStatusController', () => {
  let controller: UserStatusController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserStatusController],
      providers: [
        { provide: UserStatusService, useValue: mockUserStatusService },
      ],
    }).compile()

    controller = module.get<UserStatusController>(UserStatusController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  describe('fetchFriendStatus', () => {
    it('should return status', () => {
      const userId = 1
      const status: Status = 'CHAT'
      mockUserStatusService.fetchFriendStatus.mockReturnValue(status)

      expect(controller.fetchFriendStatus(userId)).toBe(status)
      expect(mockUserStatusService.fetchFriendStatus).toHaveBeenCalledWith(
        userId
      )
    })
  })

  describe('setStatus', () => {
    it('should set status', () => {
      const userId = 1
      const status: Status = 'CHAT'
      controller.setStatus(userId, status)

      expect(mockUserStatusService.setStatus).toHaveBeenCalledWith(
        userId,
        status
      )
    })
  })
})
