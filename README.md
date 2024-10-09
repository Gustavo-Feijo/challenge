<h1 style="text-align:center;font-size:52px;">Backend</h1>

___

Este projeto consiste em um micro serviço para gerenciar formulários de contato, enviando emails para o usuário e a empresa utilizadora do serviço.

___

## Tecnologias

Para o back-end foi utilizado Node.js com o framework Express.
A validação do body das requests foi feito através do Zod, e, o envio de emails, através de Nodemailer.

___

## Executando

Para a execução do código deve se realizar o clone deste repositório e acessar o mesmo.

```
git clone 
cd backend
```
Deve ser realizada a configuração das variaveis de ambiente no arquivo .env.

Após isto, é necessário rodar a build com Docker através de:
```
docker build -t app .
docker run --env-file .env -p 3000:3000 app
```
A partir deste ponto a API será acessível através da porta 3000.

Também é possivel rodar testes com:
```
docker build -t app_test -f Dockerfile.test .
docker run -p 3000:3000 app_test
```
Ps: Haverão erros no console refentes aos testes que são esperados falhar.

___


