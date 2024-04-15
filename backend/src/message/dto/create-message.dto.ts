// model Message {
//   id                    Int      @id @default(autoincrement())
//   content               String
//   timestamp             DateTime @default(now())
//   userId                Int
//   chatRoomId            Int
//   user                  User     @relation(fields: [userId], references: [id])
//   chatRoom              ChatRoom @relation(fields: [chatRoomId], references: [id])
//   gameParametersJson    String?
// }

import { IsNotEmpty, IsNumber, IsString } from 'class-validator'

export class CreateMessageDto {
  @IsNotEmpty()
  @IsNumber()
  myUserId: number

  @IsNotEmpty()
  @IsNumber()
  opponentUserId: number

  @IsNotEmpty()
  @IsString()
  gameParametersJson: string | undefined
}
