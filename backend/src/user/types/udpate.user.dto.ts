import { IsString, IsOptional, IsBoolean } from 'class-validator'

export class UpdateUserDto {
  @IsOptional()
  @IsString()
  username?: string

  @IsOptional()
  avatar?: Buffer

  @IsOptional()
  @IsString()
  twoFASetting?: string
}
