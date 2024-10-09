import nodemailer from "nodemailer";
import SMTPTransport from "nodemailer/lib/smtp-transport";

// Configuração para o server SMTP.
const smtpConfig: SMTPTransport.Options = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT),
  secure: process.env.MAIL_SECURE === "true",
  auth: { user: process.env.MAIL_AUTH_USER, pass: process.env.MAIL_AUTH_PASS },
};
const transporter = nodemailer.createTransport(smtpConfig);

/**
 * Função para enviar um email.
 * @param params Recebe um objeto contendo comment, userEmail e userName.
 * @returns Retorna um valor boolean indicando sucesso ou falha.
 */
export async function SendEmail({
  comment,
  userEmail,
  userName,
}: {
  comment: string;
  userEmail: string;
  userName: string;
}) {
  try {
    // Realiza o envio do email.
    await transporter.sendMail({
      from: userEmail, // Utilizando o email repassado pelo usuário como email de origem.
      to: [userEmail, process.env.BUSINESS_MAIL as string], // Enviando o email para o email do usuario e o email utilizado para auth do smtp.
      subject: process.env.TEXT_MAIL_TITLE,
      text: comment,
      html: (process.env.TEXT_MAIL_HTML as string)
        .replace("{name}", userName)
        .replace("{email}", userEmail)
        .replace("{comment}", comment),
    });
    return true;
  } catch (error) {
    console.error(error);
    return false;
  }
}
