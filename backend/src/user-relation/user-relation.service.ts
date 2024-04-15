import { Injectable } from '@nestjs/common'
import { CreateUserRelationDto } from './dto/create-user-relation.dto'
import { UserRelationRepository } from './user-relation.repository'
import { RelationType } from '@prisma/client'

enum Action {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

@Injectable()
export class UserRelationService {
  constructor(
    private readonly userRelationRepository: UserRelationRepository
  ) {}

  isFriend(userId: number, friendId: number) {
    return this.userRelationRepository.isFriend(userId, friendId)
  }

  getRelations(id: number, relationType: RelationType) {
    return this.userRelationRepository.getRelations(id, relationType)
  }

  manageRelation(UserRelationDto: CreateUserRelationDto, action: Action) {
    return this.userRelationRepository.manageRelation(UserRelationDto, action)
  }
}
