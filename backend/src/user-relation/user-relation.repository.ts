import { PrismaService } from '@/prisma/prisma.service'
import { Injectable } from '@nestjs/common'
import { HttpException, HttpStatus } from '@nestjs/common'
import { User, RelationType } from '@prisma/client'
import { CreateUserRelationDto } from './dto/create-user-relation.dto'
import { Logger } from '@nestjs/common'

enum Action {
  ADD = 'ADD',
  REMOVE = 'REMOVE',
}

@Injectable()
export class UserRelationRepository {
  constructor(private readonly prisma: PrismaService) {}
  private readonly logger = new Logger(UserRelationRepository.name)

  private handleNotFound(entity: string) {
    throw new HttpException(`${entity} not found`, HttpStatus.NOT_FOUND)
  }

  private handleAlreadyExists(entity: string) {
    throw new HttpException(`${entity} already exists`, HttpStatus.CONFLICT)
  }

  async isFriend(userId: number, friendId: number): Promise<boolean> {
    const relation = await this.prisma.userRelation.findUnique({
      where: {
        userId_relatedUserId_relationType: {
          userId: userId,
          relatedUserId: friendId,
          relationType: RelationType.FRIEND,
        },
      },
    })
    return !!relation
  }

  async getRelations(id: number, relationType: RelationType): Promise<User[]> {
    const relations = await this.prisma.userRelation.findMany({
      where: {
        userId: id,
        relationType: relationType,
      },
      include: {
        relatedUser: true,
      },
    })
    return relations.map((relation) => relation.relatedUser)
  }

  async manageRelation(
    userRelationDto: CreateUserRelationDto,
    action: Action
  ): Promise<void> {
    const relation = await this.prisma.userRelation.findMany({
      where: {
        userId: userRelationDto.userId,
        relatedUserId: userRelationDto.relatedUserId,
      },
    })

    await Promise.all(
      relation.map(async (relation) => {
        this.logger.debug(relation)
        await this.prisma.userRelation.delete({
          where: {
            id: relation.id,
          },
        })
      })
    )

    if (action === Action.ADD) {
      this.logger.debug('action is add')
      await this.prisma.userRelation.create({
        data: userRelationDto,
      })
    }
  }
}
