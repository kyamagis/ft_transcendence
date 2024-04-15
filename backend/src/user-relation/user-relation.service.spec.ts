import { Test, TestingModule } from '@nestjs/testing'
import { UserRelationService } from './user-relation.service'
import { UserRelationRepository } from './user-relation.repository'
import { CreateUserRelationDto } from './dto/create-user-relation.dto'
import { RelationType } from '@prisma/client'

jest.mock('./user-relation.repository')

describe('UserRelationService', () => {
  let service: UserRelationService
  const repoMock = {
    isFriend: jest.fn(),
    getRelations: jest.fn(),
    manageRelation: jest.fn(),
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRelationService,
        {
          provide: UserRelationRepository,
          useValue: repoMock,
        },
      ],
    }).compile()

    service = module.get<UserRelationService>(UserRelationService)
  })

  it('should be defined', () => {
    expect(service).toBeDefined()
  })

  describe('isFriend', () => {
    it('should call repository method with correct arguments', async () => {
      await service.isFriend(1, 2)
      expect(repoMock.isFriend).toHaveBeenCalledWith(1, 2)
    })
  })

  describe('getRelations', () => {
    it('should call repository method with correct arguments', async () => {
      await service.getRelations(1, RelationType.FRIEND)
      expect(repoMock.getRelations).toHaveBeenCalledWith(1, RelationType.FRIEND)
    })
  })

  describe('manageRelation', () => {
    const dto = new CreateUserRelationDto()
    dto.userId = 1
    dto.relatedUserId = 2
    dto.relationType = RelationType.FRIEND

    it('should call repository method with correct arguments for ADD action', async () => {
      await service.manageRelation(dto, 'ADD')
      expect(repoMock.manageRelation).toHaveBeenCalledWith(dto, 'ADD')
    })

    it('should call repository method with correct arguments for REMOVE action', async () => {
      await service.manageRelation(dto, 'REMOVE')
      expect(repoMock.manageRelation).toHaveBeenCalledWith(dto, 'REMOVE')
    })
  })

  // ... other test cases or additional logic
})
