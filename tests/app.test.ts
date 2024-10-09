import app from "../src/app";
import request from "supertest";

// Realiza o teste das rotas.
describe("Teste de rotas da API.", () => {
  // Teste de envio sem body.
  test("Post request sem body.", async () => {
    const response = await request(app).post("/send");
    expect(response.body.title).toBe("BadRequest");
    expect(response.status).toBe(400);
  });

  // Teste de envio com body incorreto.
  test("Post request com body incorreto", async () => {
    const response = await request(app).post("/send").send({
      "g-recaptcha-response": "",
      mail: "teste@.com",
      name: "Gustavo",
      comment: "Teste.",
    });
    expect(response.body.title).toBe("BadRequest");
    expect(response.status).toBe(400);
  });
});
