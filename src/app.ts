import express from "express";
import { RequestController } from "./controller";

// Utiliza a porta das váraiveis ou 3000 por padrão.
const port = process.env.PORT || 3000;

// Inicializa o servidor e utilizar o parser para json.
const app = express();
app.use(express.json());

// Aceita POST requests e as passa para o handler.
app.post("/send", RequestController);

// Inicia o servidor caso esteja sendo executado diretamente.
if (require.main === module) {
  app.listen(port, () => {
    console.log(`Rodando na porta ${port}`);
  });
}

export default app;
