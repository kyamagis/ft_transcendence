import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, GoogleAccount } from '@prisma/client'

@Injectable()
export class GoogleAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findGoogleAccountByEmail(email: string) {
    return await this.prisma.googleAccount.findUnique({
      where: { email: email },
    })
  }

  async createGoogleUser(
    googleUser: Prisma.GoogleAccountCreateInput
  ): Promise<GoogleAccount> {
    return await this.prisma.googleAccount.create({
      data: googleUser,
    })
  }
}
