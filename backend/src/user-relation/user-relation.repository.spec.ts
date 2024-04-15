import { Test, TestingModule } from '@nestjs/testing'
import { UserRelationRepository } from './user-relation.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { RelationType } from '@prisma/client'

describe('UserRelationRepository', () => {
  let userRelationRepository: UserRelationRepository
  const mockPrismaService = {
    userRelation: {
      findUnique: jest.fn(),
      findMany: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
  }

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UserRelationRepository,
        {
          provide: PrismaService,
          useValue: mockPrismaService,
        },
      ],
    }).compile()

    userRelationRepository = module.get<UserRelationRepository>(
      UserRelationRepository
    )
  })

  it('should be defined', () => {
    expect(userRelationRepository).toBeDefined()
  })

  // Other test cases...
  describe('isFriend', () => {
    it('should return true if the users are friends', async () => {
      mockPrismaService.userRelation.findUnique.mockResolvedValue({
        userId: 1,
        relatedUserId: 2,
        relationType: RelationType.FRIEND,
      })
      const result = await userRelationRepository.isFriend(1, 2)
      expect(result).toBeTruthy()
    })

    it('should return false if the users are not friends', async () => {
      mockPrismaService.userRelation.findUnique.mockResolvedValue(null)
      const result = await userRelationRepository.isFriend(1, 2)
      expect(result).toBeFalsy()
    })
  })
})
