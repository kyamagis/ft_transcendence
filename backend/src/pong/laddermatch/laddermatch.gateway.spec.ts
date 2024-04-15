import { Test, TestingModule } from '@nestjs/testing'
import { LadderMatchGateway } from './laddermatch.gateway'

describe('LadderMatchGateway', () => {
  let gateway: LadderMatchGateway

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [LadderMatchGateway],
    }).compile()

    gateway = module.get<LadderMatchGateway>(LadderMatchGateway)
  })

  it('should be defined', () => {
    expect(gateway).toBeDefined()
  })
})
