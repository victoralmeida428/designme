// cypress/support/index.d.ts

declare namespace Cypress {
  interface Chainable {
    /**
     * Comando customizado para realizar login via formulário.
     * @example cy.login('email@exemplo.com', 'senha123')
     */
    login(email: string, password: string): Chainable<void>;
  }
}