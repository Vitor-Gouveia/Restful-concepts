# Dia 1
REST é um acrônimo de, Representational State Transfer.
É uma forma de desenvolver APIs, assim como SOAP.
No caso, APIs REST utilizam da estrutura de dados JSON, diferente de SOAP que utiliza XML por exemplo.
Quando se fala em desenvolver APIs com javascript, o REST é padrão da indústria.

## Regras

### HTTP
> Hypertext Transfer Protocol

HTTP é o meio que websites e APIs se comunicam. O HTTP possui algumas formas diferentes de comunicação para diferentes necessidades, esses são os Métodos HTTP, como POST, OPTIONS, GET e DELETE. Esses metódos possuem algumas funcionalidades já pré-definidas, como o DELETE sendo para excluir/pedir exclusão de entidades e o GET para pegar recursos.

### Rotas
Em uma API é padrão separar os conteúdos por rota, "/users" para acesso a recursos de usuário, "/posts" para acesso a recursos de posts e etc.

Essas rotas geralmente são feitas no plural e seguem algumas regras. Vamos levar a rota de "/users" como exemplo.

/users      - Recursos de usuários
/users/:id  - Recursos de usuários específicos (filtrados pela propriedade "id")

### Métodos
Existem também funcionalidades específicas relacionadas aos métodos HTTP

get - utilizado para receber recursos
head - retorna os _headers_ que o método GET normalmente retornaria
post - utilizado para criar recursos
put - utilizado para modificar recursos gerais
patch - utilizado para modificar recursos específicos
delete - utilizado para deletar recurso
trace - trace retorna o estado do servidor
options - retorna os métodos HTTP que aquela rota aceita
connect - estabelece uma conexão segura com outro servidor

Para classificar qual método utilizar ou não é possível utilizar a tabela abaixo.

![tabela](https://raw.githubusercontent.com/equivalent/scrapbook2/master/assets/images/2016/put-patch-idempotance-table.png)]

### Resposta HTTP
Os códigos de resposta também são padronizados

Camada 100 - Informacional
Camada 200 - Sucesso
Camada 300 - Redirecionamento
Camada 400 - Erro de cliente
Camada 500 - Erro de servidor

# Dia 2
Criei o meu próprio "express.js" para testar os conceitos REST. Nessa aplicação eu coloco em prática o meu conhecimento sobre alguns métodos HTTP e também minha habilidade em "clonar" bibliotecas.

O código pode ser encontrado na pasta `examples/01` no arquivo `index.mjs`.

# Dia 3
## O que faz uma API RESTful?
Existem algumas propriedades que tornam uma API RESTful.

- Client separado do Servidor
    O client e servidor não estão no mesmo diretório
- Stateless
    O request possui todas as informações necessárias para o servidor processar e devolver uma resposta
- Cacheable
    O servidor possui a habilidade de inserir informações em um cache para retornar mais rapidamente ao front-end
