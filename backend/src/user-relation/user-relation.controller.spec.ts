import { Test, TestingModule } from '@nestjs/testing'
import { UserRelationController } from './user-relation.controller'
import { UserRelationService } from './user-relation.service'
import { CreateUserRelationDto } from './dto/create-user-relation.dto'
import { RelationType } from '@prisma/client'
import { SessionGuard } from '@/auth/guards/session.guard'
import { TwoFAGuard } from '@/auth/guards/2fa.guard'
import { SessionRepository } from '@/repository/session.repository'

// userRelationServiceのモック
const mockUserRelationService = {
  isFriend: jest.fn(),
  getRelations: jest.fn(),
  manageRelation: jest.fn(),
}

// SessionGuardのモック
const mockSessionGuard = {
  canActivate: jest.fn().mockReturnValue(true),
}

// TwoFAGuardのモック
const mockTwoFAGuard = {
  canActivate: jest.fn().mockReturnValue(true),
}

// SessionRepositoryのモック
const mockSessionRepository = {
  findSessionById: jest.fn(),
  updateSession: jest.fn(),
}

describe('UserRelationController', () => {
  let controller: UserRelationController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserRelationController],
      providers: [
        { provide: UserRelationService, useValue: mockUserRelationService },
        { provide: SessionGuard, useValue: mockSessionGuard },
        { provide: TwoFAGuard, useValue: mockTwoFAGuard },
        { provide: SessionRepository, useValue: mockSessionRepository },
      ],
    }).compile()

    controller = module.get<UserRelationController>(UserRelationController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should call isFriend on service with correct parameters', async () => {
    const userId = 1
    const friendId = 2
    await controller.isFriend(userId, friendId)
    expect(mockUserRelationService.isFriend).toHaveBeenCalledWith(
      userId,
      friendId
    )
  })

  it('should call getRelations on service with correct parameters', async () => {
    const id = 1
    const relationType = RelationType.FRIEND
    await controller.getRelations(id, relationType)
    expect(mockUserRelationService.getRelations).toHaveBeenCalledWith(
      id,
      relationType
    )
  })

  it('should call manageRelation on service with correct parameters', async () => {
    const createUserRelationDto = new CreateUserRelationDto()
    const action = 'ADD'
    await controller.manageRelation(createUserRelationDto, action)
    expect(mockUserRelationService.manageRelation).toHaveBeenCalledWith(
      createUserRelationDto,
      action
    )
  })
})
