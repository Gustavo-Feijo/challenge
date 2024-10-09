import { z } from "zod";

/**
 * Schema para validação dos inputs do usuário.
 */
export const requestSchema = z.object({
  "g-recaptcha-response": z
    .string({ message: "O campo captcha deve ser uma string." })
    .min(1, {
      message: "O campo recaptcha não foi preenchido.",
    }),
  comment: z
    .string({ message: "O campo comentário deve ser uma string." })
    .min(10, {
      message: "O campo comentário deve conter ao menos 10 caracteres.",
    })
    .max(200, {
      message: "O campo comentário deve conter no máximo 200 caracteres.",
    }),
  name: z
    .string({ message: "O campo name deve ser uma string." })
    .min(1, { message: "O campo name não foi preenchido." }),
  mail: z
    .string({ message: "O campo mail deve ser uma string." })
    .min(1, { message: "O campo mail não foi preenchido." })
    .email({ message: "O email deve ser válido." }),
});

/**
 * Função para validação do recaptcha.
 * @param token Token fornecido pelo usuario.
 * @returns Retorna se a validação foi um sucesso ou falha.
 */
export async function validateRecaptcha(token: string) {
  // Recupera URL e chave das variaveis de ambiente e verifica se estão presentes.
  const url = process.env.RECAPTCHA_URL;
  const key = process.env.RECAPTCHA_KEY;
  if (!url || !key) {
    throw new Error("URL ou Key do Recaptcha faltando.");
  }

  // Payload para a API do Recaptcha.
  const data = { secret: key, response: token };
  // Realiza uma request para a URL para verificar se o recaptcha foi um sucesso.
  try {
    const req = await fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });

    // Verifica se não houve erro na request.
    if (!req.ok) {
      throw new Error("Erro na request para recaptcha.");
    }

    // Pega o body como json.
    const response = await req.json();

    // Verifica se a resposta foi bem sucedida.
    if (response.success) {
      return true;
    }
    // Retorn falso caso não.
    return false;
  } catch (error) {
    console.error(error);
    // Retorna falso no caso de erros.
    return false;
  }
}
