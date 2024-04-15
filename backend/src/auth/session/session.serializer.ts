import { User } from '@prisma/client'
import { Injectable } from '@nestjs/common'
import { PassportSerializer } from '@nestjs/passport'
import { UserRepository } from '@/user/user.repository'
import ValidateUser from '../types/validate.user.interface'

@Injectable()
export class SessionSerializer extends PassportSerializer {
  constructor(private userRepository: UserRepository) {
    super()
  }

  serializeUser(
    user: ValidateUser,
    done: (err: Error, id: number) => void
  ): void {
    if (user && user.id) {
      done(null, user.id)
    } else {
      done(new Error('User not found'), null)
    }
  }

  async deserializeUser(
    id: number,
    done: (err: Error, user: User) => void
  ): Promise<void> {
    try {
      const user = await this.userRepository.findUserById(id)
      if (user) {
        done(null, user)
      } else {
        done(new Error('User ID not found: ' + id), null)
      }
    } catch (err) {
      done(err, null)
    }
  }
}
