import { describe, expect, test } from "@jest/globals";
import { requestSchema, validateRecaptcha } from "../src/validation";

// Teste para validação do schema.
describe("Teste de validação do schema com Zod.", () => {
  // Body válido.
  test("Validação de body válido.", () => {
    // Entrada de dados válidos.
    const data = {
      "g-recaptcha-response": "resultadodocaptcha",
      mail: "teste@gmail.com",
      name: "Gustavo",
      comment: "Teste de validação do schema.",
    };
    // Recebe o resultado do safeParse e varifica se foi um sucesso.
    const result = requestSchema.safeParse(data);
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data).toEqual(data);
    }
  });

  // Realiza testes para diversos bodys invalidos.
  test.each([
    [
      "g-recaptcha-response vazio",
      {
        "g-recaptcha-response": "",
        mail: "teste@gmail.com",
        name: "Gustavo",
        comment: "Teste de validação do schema.",
      },
    ],
    [
      "Email inválido",
      {
        "g-recaptcha-response": "resultadodocaptcha",
        mail: "teste@.com",
        name: "Gustavo",
        comment: "Teste de validação do schema.",
      },
    ],
    [
      "Nome vazio",
      {
        "g-recaptcha-response": "resultadodocaptcha",
        mail: "teste@gmail.com",
        name: "",
        comment: "Teste de validação do schema.",
      },
    ],
    [
      "Comentário muito curto",
      {
        "g-recaptcha-response": "resultadodocaptcha",
        mail: "teste@gmail.com",
        name: "Gustavo",
        comment: "Curto",
      },
    ],
    [
      "Todos os campos inválidos",
      { "g-recaptcha-response": "", mail: "invalid", name: "", comment: "" },
    ],
  ])("Validação de body inválido - %s", (_, invalido) => {
    const result = requestSchema.safeParse(invalido);
    expect(result.success).toBe(false);
    if (!result.success) {
      expect(result.error.errors.length).toBeGreaterThan(0);
    }
  });
});

global.fetch = jest.fn();

// Teste para validação do recaptcha.
describe("Teste de validação de requests.", () => {
  // Armazena as variaveis de ambiente originais.
  const originalEnv = process.env;

  // Recarrega as variaveis de ambiente.
  beforeEach(() => {
    jest.resetModules();
    process.env = { ...originalEnv };
  });

  // Reseta as variaveis ao final de tudo.
  afterAll(() => {
    process.env = originalEnv; // Restore original environment variables
  });

  test("Deve retornar validação positiva.", async () => {
    // Carrega variaveis de ambiente.
    process.env.RECAPTCHA_URL = "https://dummyurl.com/recaptcha";
    process.env.RECAPTCHA_KEY = "dummy_key";
    // Cira mocking com sucesso.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: true }),
    });

    const result = await validateRecaptcha("dummy_token");
    expect(result).toBe(true);
    expect(fetch).toHaveBeenCalledWith(
      process.env.RECAPTCHA_URL,
      expect.any(Object)
    );
  });

  test("Recaptcha não sucedido.", async () => {
    // Carrega variaveis de ambiente.
    process.env.RECAPTCHA_URL = "https://dummyurl.com/recaptcha";
    process.env.RECAPTCHA_KEY = "dummy_key";
    // Cira mocking com falha.
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: true,
      json: async () => ({ success: false }),
    });
    const result = await validateRecaptcha("dummy_token");
    expect(result).toBe(false);
  });

  test("Espera um erro caso a URL não seja inserida.", async () => {
    // Carrega variavel de ambiente incorreta.
    process.env.RECAPTCHA_URL = undefined;
    await expect(validateRecaptcha("dummy_token")).rejects.toThrow(
      "URL ou Key do Recaptcha faltando."
    );
  });

  test("Erro na request.", async () => {
    // Carrega variaveis de ambiente.
    process.env.RECAPTCHA_URL = "https://dummyurl.com/recaptcha";
    process.env.RECAPTCHA_KEY = "dummy_key";
    (fetch as jest.Mock).mockResolvedValueOnce({
      ok: false,
    });

    const result = await validateRecaptcha("dummy_token");
    expect(result).toBe(false);
  });

  test("Erro de rede.", async () => {
    // Carrega variaveis de ambiente.
    process.env.RECAPTCHA_URL = "https://dummyurl.com/recaptcha";
    process.env.RECAPTCHA_KEY = "dummy_key";
    (fetch as jest.Mock).mockImplementationOnce(() => {
      throw new Error("Network error");
    });

    const result = await validateRecaptcha("dummy_token");
    expect(result).toBe(false);
  });
});
