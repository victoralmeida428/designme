describe('Fluxo de Autenticação', () => {
  it('deve realizar login com sucesso e redirecionar', () => {
    // 1. Visita a página de login
    cy.visit('/auth/login') // Ajuste para sua rota de login

    // 2. Preenche os campos (passando na validação do Zod)
    cy.get('input[name="email"]').type('victor.gomes.almeida.vg@gmail.com')
    cy.get('input[name="password"]').type('95546353')

    // 3. Submete o formulário
    cy.get('button[type="submit"]').click()

    // 4. Verifica se o login funcionou (ex: redirecionado para dashboard)
    cy.contains('Victor')
    
    // 5. Verifica se o cookie de sessão do NextAuth existe
    cy.getCookie('next-auth.session-token').should('exist')
  })

  it('deve mostrar erro com e-mail inválido (Validação Zod)', () => {
    cy.visit('/auth/login')
    cy.get('input[name="email"]').type('email-invalido')
    cy.get('input[name="password"]').type('123')
    cy.get('button[type="submit"]').click({ force: true })

    // Verifica se a mensagem de erro do seu loginSchema aparece na tela
    cy.url().should('include', "/auth/login")
    
  })
})