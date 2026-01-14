import pool from "@/lib/db";

type UserAuth = {
    email: string
    password: string
    name: string
    role: string
    id: string
}

export async function getUserByEmailAction(email: string): Promise<UserAuth|null> {
    try {
        const {rows} = await pool.query<UserAuth>("select * from users where email=$1", [email]);
        if  (rows.length === 0) {
            return null;
        }
        const user = rows[0];
        return {
            email: user.email,
            password: user.password,
            name: user.name,
            role: user.role,
            id: String(user.id),
        }

    } catch (error) {
        console.log('Erro ao buscar usuário', error);
        throw new Error("Erro interno ao processar a solicitação de usuário.");
    }
}