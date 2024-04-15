import { Test, TestingModule } from '@nestjs/testing'
import { UserSearchController } from './user-search.controller'
import { UserSearchService } from './user-search.service'
import { SessionGuard } from '@/auth/guards/session.guard'
import { Request as ExpressRequest, Response as ExpressResponse } from 'express'
import { TwoFAGuard } from '@/auth/guards/2fa.guard'
import { SessionRepository } from '@/repository/session.repository'

/* 
このテストスイートは、UserSearchController の振る舞いを検証します。
具体的には、コントローラが正しく定義されており、正しいクエリに基づいてユーザー検索機能を正常に実行することを確認します。
依存関係 UserSearchService および SessionGuard はモック化され、テストモジュール内でコントローラのインスタンスを取得しています。
各テストケースでは、Jest のアサーションを使用して期待される関数呼び出しとレスポンスを確認します。
 */

// UserSearchServiceのモック
const mockUserSearchService = {
  userSearch: jest.fn().mockResolvedValue([{ id: 1, username: 'testuser' }]),
}

// SessionGuardのモック
const mockSessionGuard = {
  canActivate: jest.fn().mockReturnValue(true),
}

// TwoFAGuardのモック
const mockTwoFAGuard = {
  canActivate: jest.fn().mockReturnValue(true),
}

// SessionRepositoryのモック
const mockSessionRepository = {
  findSessionById: jest.fn(),
  updateSession: jest.fn(),
}

describe('UserSearchController', () => {
  let controller: UserSearchController

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [UserSearchController],
      providers: [
        { provide: UserSearchService, useValue: mockUserSearchService },
        { provide: SessionGuard, useValue: mockSessionGuard },
        { provide: TwoFAGuard, useValue: mockTwoFAGuard },
        { provide: SessionRepository, useValue: mockSessionRepository },
      ],
    }).compile()

    controller = module.get<UserSearchController>(UserSearchController)
  })

  it('should be defined', () => {
    expect(controller).toBeDefined()
  })

  it('should return users on valid query', async () => {
    const mockReq: Partial<ExpressRequest> = {}
    const mockRes: Partial<ExpressResponse> = {
      setHeader: jest.fn(),
      send: jest.fn(),
    }

    await controller.userSearch(
      'test',
      mockReq as ExpressRequest,
      mockRes as ExpressResponse
    )

    expect(mockUserSearchService.userSearch).toHaveBeenCalledWith('test')
    expect(mockRes.setHeader).toHaveBeenCalledWith(
      'Content-Type',
      'application/json'
    )
    expect(mockRes.send).toHaveBeenCalledWith([{ id: 1, username: 'testuser' }])
  })
})
