import SendEmailDTO from "@/dto/send-email-dto"
import nodemailer from "nodemailer"

const transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT) || 587,
    secure: false,
    auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS
    }
})

export async function sendEmail({to, subject, html}:SendEmailDTO) {
    try {
        const info = await transporter.sendMail({
            from: `"DesignMe" <${process.env.SMTP_USER}>`,
            to,
            subject,
            html,
        })
        console.log("Email enviado: %s", info.messageId)
        return {success: true}
    } catch(error) {
        console.error("Erro ao enviar email: ", error)
        return {success: false, error}
    }

}