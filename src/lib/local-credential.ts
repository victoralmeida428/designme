import { loginSchema } from "@/schemas/login-schema"
import Credentials from "next-auth/providers/credentials"
import pool from "./db"
import { Provider } from "next-auth/providers/index"
import { ComparePass } from "@/utils/bcrypt"

export default function LocalCredential(): Provider {
    return Credentials({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            const parsedCredentials = loginSchema.safeParse(credentials)

            if (!parsedCredentials.success) {
                console.error("❌ Falha no Zod:", parsedCredentials.error.format());
                return null
            }

            const { email, password } = parsedCredentials.data

            // 2. Buscar usuário no banco (Incluindo o campo role/admin)
            const result = await pool.query("SELECT * FROM users WHERE email = $1", [email])
            const user = result.rows[0]

            // 3. Verificar se usuário existe e se tem senha (usuário do Google não tem senha)
            if (!user || !user.password) {
                return null
            }

            // 4. Comparar a senha digitada com a hash do banco
            const passwordsMatch = await ComparePass(password, user.password)

            if (passwordsMatch) {
                // Retornamos o objeto do usuário
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }

            return null
        },
    })
} 
