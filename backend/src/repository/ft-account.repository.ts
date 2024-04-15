import { Injectable } from '@nestjs/common'
import { PrismaService } from '@/prisma/prisma.service'
import { Prisma, FtAccount } from '@prisma/client'

@Injectable()
export class FtAccountRepository {
  constructor(private readonly prisma: PrismaService) {}

  async findFtAccountByFtId(ftId: string) {
    return await this.prisma.ftAccount.findUnique({
      where: { ftId: ftId },
    })
  }

  async createFtUser(ftUser: Prisma.FtAccountCreateInput): Promise<FtAccount> {
    return await this.prisma.ftAccount.create({
      data: ftUser,
    })
  }
}
