import nodemailer from "nodemailer"
import dotenv from "dotenv"
dotenv.config()



const transporter = nodemailer.createTransport({
    service: "gmail",
    host: process.env.HOST_MAILTRAP,
    port: process.env.PORT_MAILTRAP,
    auth: {
    user: process.env.USER_MAILTRAP,
    pass: process.env.PASS_MAILTRAP,
    },
})

/**
 * Función genérica para enviar correos
 * @param {string} to - Email del destinatario
 * @param {string} subject - Asunto del correo
 * @param {string} html - Contenido HTML del correo
 */
const sendMail = async (to, subject, html) => {

    try {
        const info = await transporter.sendMail({
            from: '"SMARTVET" <admin@vet.com>',
            to,
            subject,
            html,
        })
        console.log("✅ Email enviado:", info.messageId)

    } catch (error) {
        console.error("❌ Error enviando email:", error.message)
    }
}

const sendMailToRecoveryPassword = (userMail, token) => {

    return sendMail(
        userMail,
        "Recupera tu contraseña",
        `
            <h1>SMARTVET - 🐶 😺</h1>
            <p>Has solicitado restablecer tu contraseñab.</p>
            <a href="${process.env.URL_FRONTEND}recuperarpassword/${token}">
            Clic para restablecer tu contraseña
            </a>
            <hr>
            <footer>El equipo de SMARTVET te da la más cordial bienvenida.</footer>
        `
        )
}


export {
    sendMail,                 // 👈 exporta la función base
    sendMailToRecoveryPassword // 👈 exporta también la específica
}