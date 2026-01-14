import bcrypt from "bcrypt"

export const BcryptPass = async function(password: string): Promise<String> {
   return await bcrypt.hash(password, 10)
}

export const ComparePass = async function(passowrd: string, hash: string) {
   return await bcrypt.compare(passowrd, hash)
}