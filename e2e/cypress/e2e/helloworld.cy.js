describe('Button Click Test', function () {
  it('should display "OK" after button click', function () {
    cy.visit('/')

    cy.get('button').click()

    cy.contains('OK')
  })
})
