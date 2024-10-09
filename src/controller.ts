import { Request, Response } from "express";
import { ZodError } from "zod";
import { requestSchema, validateRecaptcha } from "./validation";
import { SendEmail } from "./utils";

/**
 * Handle para as requests.
 * @params Recebe como parametros request e response.
 * @returns Retorna uma response ao cliente e retorna void.
 */
export async function RequestController(req: Request, res: Response) {
  try {
    // Realiza a validação básica com Zod.
    const response = await requestSchema.parseAsync(req.body);
    console.log("Request apresenta body valido.");

    // Realiza a validação do captcha.
    const recaptchaValido = await validateRecaptcha(
      response["g-recaptcha-response"]
    );

    // Retorna response com erro caso o captcha seja invalido.
    if (!recaptchaValido) {
      res.status(401).json({
        type: "about:blank",
        title: "UnauthorizedError",
        detail: "O captcha preenchido está incorreto.",
        instance: req.baseUrl,
      });
      return;
    }
    console.log("Recaptcha validado com sucesso.");

    // Realiza o envio de um email e recebe um boolean contendo o resultado.
    const envioEmail = await SendEmail({
      comment: response.comment,
      userEmail: response.mail,
      userName: response.name,
    });

    // Retorn o erro para caso o email não tenha sido enviado.
    if (!envioEmail) {
      res.status(500).json({
        type: "about:blank",
        title: "InternalServerError",
        detail: "Não foi possível realizar o envio do email.",
        instance: req.baseUrl,
      });
      return;
    }
    console.log("Email enviado com sucesso.");

    // Retorna response de sucesso.
    res.status(201).send();
    return;
  } catch (error) {
    // Retorna responses em caso de erros de validação com Zod.
    if (error instanceof ZodError) {
      res.status(400).json({
        type: "about:blank",
        title: "BadRequest",
        detail: error.errors[0].message,
        instance: req.baseUrl,
      });
      return;
    }

    // Response contendo um erro não tratado.
    res.status(500).json({
      type: "about:blank",
      title: "InternalServerError",
      detail: "Um erro ocorreu no servidor.",
      instance: req.baseUrl + req.path,
    });
    return;
  }
}
