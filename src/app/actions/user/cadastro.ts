"use server"

import ResponseDTO from "@/dto/response-dto";
import pool from "@/lib/db";
import { CadastroUserValues } from "@/schemas/cadastro-user-schema";
import { BcryptPass } from "@/utils/bcrypt";

export async function cadastrarUserAction(data: CadastroUserValues): Promise<ResponseDTO> {
    const client = await pool.connect();
    try {
        const query = `
        insert into users (name, email, password, role)
        values ($1, $2, $3, $4)
        returning id        
        `;

        const hashedPassword = await BcryptPass(data.senha)

        const parameters = [data.nome, data.email, hashedPassword, 'client'];
        const { rowCount } = await client.query(query, parameters);
        if (rowCount === 0) {
            return { success: false, message: "Não foi possível completar o cadastro." };
        }
        return { success: true, message: "Usuário cadastrado com sucesso" };

    } catch (error: any) {
        console.log(error)
        if (error.code === '23505') {
            return { success: false, message: "Este e-mail já está em uso." };
        }

        return { success: false, message: "Erro interno no servidor. Tente novamente." };
    } finally {
        client.release()
    }

}