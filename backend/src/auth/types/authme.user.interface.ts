import type { User } from '@prisma/client'

export default interface AuthMeUser extends User {
  needTwoFA: boolean
}
