import { Test, TestingModule } from '@nestjs/testing'
import { VSCpuGateway } from './vscpu.gateway'
import { Logger } from '@nestjs/common'

// describe('VSCpuGateway', () => {
//   let gateway: VSCpuGateway

//   beforeEach(async () => {
//     const module: TestingModule = await Test.createTestingModule({
//       providers: [VSCpuGateway],
//     }).compile()

//     gateway = module.get<VSCpuGateway>(VSCpuGateway)
//   })

//   it('should be defined', () => {
//     expect(gateway).toBeDefined()
//   })

//   it('should handle key action', () => {
//     const client = { id: 'testClientId' } // ダミーのクライアント
//     const keyAction = 'keyUp'

//     // handleKeyメソッドを呼び出す
//     gateway.handleKey(client, keyAction)

//     // ここで、適切な検証を行う
//     // 例: socketMapの状態をチェック
//     expect(gateway['socketMap'].has(client)).toBe(true)
//     expect(gateway['socketMap'].get(client).paddleMovement.isKeyDown).toBe(
//       'Neutral'
//     )
//   })

//   it('should handle CPU', () => {
//     const client = { id: 'testClientId' } // ダミーのクライアント
//     const gameParameterArray = [] // ダミーのゲームパラメータ配列

//     // handleCpuメソッドを呼び出す
//     gateway.handleCpu(client, gameParameterArray)

//     // ここで、適切な検証を行う
//     // 例: socketMapの状態をチェック
//     expect(gateway['socketMap'].has(client)).toBe(true)
//   })

//   // it('should handle connection', async () => {})

//   it('should handle disconnection', () => {
//     const client = { id: 'testClientId' } // ダミーのクライアント

//     // ダミーのデータをsocketMapに追加
//     gateway['socketMap'].set(client, {
//       intervalID: 123,
//       paddleMovement: { isKeyDown: 'Neutral' },
//     })

//     // handleDisconnectメソッドを呼び出す
//     gateway.handleDisconnect(client)

//     // ここで、適切な検証を行う
//     // 例: socketMapの状態をチェック
//     expect(gateway['socketMap'].has(client)).toBe(false)
//   })
// })
