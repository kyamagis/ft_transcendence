import { Module } from '@nestjs/common'
import { VSCpuGateway } from './vscpu/vscpu.gateway'
import { LadderMatchGateway } from './laddermatch/laddermatch.gateway'
import { PongRepository } from '@/repository/pong.repository'
import { PrismaService } from '@/prisma/prisma.service'
import { InvitationalMatchGateway } from './invitationalmatch/invitationalmatch.gateway'
@Module({
  providers: [
    VSCpuGateway,
    LadderMatchGateway,
    InvitationalMatchGateway,
    PongRepository,
    PrismaService,
  ],
})
export class PongModule {}
