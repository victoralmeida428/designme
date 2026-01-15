import { loginSchema } from "@/schemas/login-schema"
import Credentials from "next-auth/providers/credentials"
import { Provider } from "next-auth/providers/index"
import { ComparePass } from "@/utils/bcrypt"
import { getUserByEmailAction } from "@/app/actions/auth/get-user"

export default function LocalCredential(): Provider {
    return Credentials({
        name: "credentials",
        credentials: {
            email: { label: "Email", type: "email" },
            password: { label: "Password", type: "password" },
        },
        async authorize(credentials) {
            // LOG 1: Entrada na função
            console.log(">>> DEBUG: FUNÇÃO AUTHORIZE INICIADA");
            console.log(">>> DADOS RECEBIDOS:", credentials);

            const parsedCredentials = loginSchema.safeParse(credentials)

            if (!parsedCredentials.success) {
                // LOG 2: Falha no Zod
                console.error(">>> DEBUG: ZOD VALIDATION FAILED!");
                console.error(">>> ERROS:", JSON.stringify(parsedCredentials.error.flatten(), null, 2));
                return null
            }

            const { email, password } = parsedCredentials.data
            console.log(">>> DEBUG: ZOD PASSOU. BUSCANDO USUÁRIO:", email);

            const user = await getUserByEmailAction(email)

            if (!user) {
                console.warn(">>> DEBUG: USUÁRIO NÃO ENCONTRADO NO BANCO");
                return null
            }

            if (!user.password) {
                console.warn(">>> DEBUG: USUÁRIO SEM SENHA (PROVAVELMENTE SOCIAL LOGIN)");
                return null
            }

            const passwordsMatch = await ComparePass(password, user.password)
            console.log(">>> DEBUG: RESULTADO BCRYPT:", passwordsMatch);

            if (passwordsMatch) {
                return {
                    id: user.id,
                    name: user.name,
                    email: user.email,
                    role: user.role,
                }
            }

            console.warn(">>> DEBUG: SENHA INCORRETA");
            return null
        },
    })
}