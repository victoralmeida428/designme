export function getPasswordResetTemplate(token: string) {
  const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/reset-password?token=${token}`

  return `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h2>Recuperação de Senha</h2>
      <p>Você solicitou a redefinição de senha.</p>
      <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #000; color: #fff; text-decoration: none; border-radius: 5px;">
        Redefinir Senha
      </a>
    </div>
  `
}

export function getWelcomeTemplate(name: string) {
  return `
    <div>
      <h1>Bem-vindo, ${name}!</h1>
      <p>Estamos felizes em ter você aqui.</p>
    </div>
  `
}