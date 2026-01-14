import bcrypt from "bcrypt"

export const BcryptPass = async function(password: string): Promise<String> {
   return await bcrypt.hash(password, 10)
}