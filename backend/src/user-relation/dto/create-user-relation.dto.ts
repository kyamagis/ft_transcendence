/* 
Prisma schema
model UserRelation {
  id            Int          @id @default(autoincrement())
  userId        Int
  relatedUserId Int
  relationType  RelationType
  createdAt     DateTime     @default(now())
  updatedAt     DateTime     @default(now()) @updatedAt
  user          User         @relation("UserToRelation", fields: [userId], references: [id])
  relatedUser   User         @relation("RelatedUserToRelation", fields: [relatedUserId], references: [id])

  @@unique([userId, relatedUserId, relationType])
}
*/

import { RelationType } from '@prisma/client'
import { IsEnum, IsNotEmpty, IsNumber } from 'class-validator'

// 上記の Prisma schema に対応する DTO
export class CreateUserRelationDto {
  @IsNotEmpty()
  @IsNumber()
  userId: number

  @IsNotEmpty()
  @IsNumber()
  relatedUserId: number

  @IsNotEmpty()
  @IsEnum(RelationType)
  relationType: RelationType
}
