describe('Navigation Component', () => {

  // テストユーザーとセッションを作成
  beforeEach(() => {
    cy.task('createTestUserAndSession').then(data => {
      // セッションIDをクッキーとして設定
      cy.setCookie('sessionId', data.session.sid);
    });
    // ルートページにアクセス
    cy.visit('/');
  });

  // テスト後にテストユーザーを削除
  afterEach(() => {
    cy.task('deleteTestUser');
  });

  it('should render Navigation component correctly', () => {
    // URLが正しくなっていることを確認
    cy.url().should('eq', Cypress.config().baseUrl + '/pong');

    // 左上のアイコンが存在することを確認
    cy.get('Image[alt="favicon"]').should('be.visible');

    // ナビゲーションリンクが存在することを確認
    cy.contains('Pong').should('exist');
    cy.contains('Chat').should('exist');

    // アバター画像が表示されていることを確認
    cy.get('Image[alt="avatar"]').should('be.visible');

    // モーダル関連のボタンが正常に動作するかをテストする場合
    // 例: 'Your Profile'ボタンをクリックして、モーダルが開くかのテスト
    cy.contains('Your Profile').click();
    cy.get('ProfileModal').should('be.visible');
  });
});
