describe('42 OAuth Login', () => {

  beforeEach(() => {
    cy.visit('/'); 
  });

  it('should display 42 login button and redirect', () => {
    // 42ログインボタンを確認
    cy.contains('Sign in with 42.').should('exist');

    // ボタンをクリックしてリダイレクトを確認
    cy.contains('Sign in with 42.').click();

    // リダイレクトが正しく行われることを確認（実際のリダイレクトURLに置き換える）
    cy.url({ timeout: 1000}).should('include', 'https://auth.42.fr/auth/realms/students-42/');

  });

});
