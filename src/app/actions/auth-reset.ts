import pool from "@/lib/db";
import bcrypt from "bcrypt"
import { v4 as uuidv4 } from "uuid";

export async function requestPasswordResetAction(email: string) {
    try {
        const userResult = await pool.query(
            "SELECT id_usuario FROM usuario WHERE email = $1",
            [email]
        );
        if (userResult.rowCount === 0) {
            return { success: false, message: "E-mail não encontrado" };
        }

        const user = userResult.rows[0]
        const token = uuidv4()

        await pool.query(
            `insert into password_resets(id_usuario, token, expires_at)
            values ($1, $2, now() + interval '1 hour')`,
            [user.id_usuario, token]
        )
        const resetLink = `${process.env.NEXT_PUBLIC_APP_URL}/admin/reset-password?token=${token}`
        console.log("Reset link:", resetLink)

        // TODO: Chamar seu serviço de email aqui (Resend, Nodemailer, etc)

        return { success: true, message: "Link de recuperação enviado" }
    } catch(error) {
        console.error("Erro ao solicitar reset:", error)
        return { success: false, message: "Erro interno" }
    }
    
}

export async function resetPasswordAction(token: string, newPassword: string) {
  // Para transações, precisamos de um client específico, não podemos usar pool.query direto
  const client = await pool.connect()

  try {
    // 1. Validar Token antes de abrir transação
    const tokenResult = await client.query(
      `SELECT * FROM password_resets 
       WHERE token = $1 
       AND used = FALSE 
       AND expires_at > NOW()`,
      [token]
    )

    const resetRecord = tokenResult.rows[0]

    if (!resetRecord) {
      return { success: false, message: "Link inválido ou expirado." }
    }

    // 2. Hash da senha
    const hashedPassword = await bcrypt.hash(newPassword, 10)

    // 3. Iniciar Transação
    await client.query("BEGIN")

    // Atualiza a senha do usuário
    await client.query(
      "UPDATE usuario SET senha = $1 WHERE id_usuario = $2",
      [hashedPassword, resetRecord.id_usuario]
    )

    // Marca o token como usado para impedir reuso
    await client.query(
      "UPDATE password_resets SET used = TRUE WHERE id = $1",
      [resetRecord.id]
    )

    // Confirma as alterações
    await client.query("COMMIT")

    return { success: true, message: "Senha alterada com sucesso!" }

  } catch (error) {
    // Se der erro, desfaz tudo
    await client.query("ROLLBACK")
    console.error("Erro no resetPasswordAction:", error)
    return { success: false, message: "Erro ao redefinir a senha." }
  } finally {
    client.release()
  }
}