# MyEvents: Sistema de Gerenciamento de Eventos

## 🎯 Visão Geral do Projeto

O **MyEvents** é um projeto *full-stack* desenvolvido como trabalho prático para a disciplina de **Banco de Dados (DB) 2025.2**. Nosso objetivo principal foi aplicar os conceitos de modelagem, persistência e manipulação de dados SQL em um cenário real, culminando na criação de um sistema funcional para o gerenciamento de eventos.

## 💡 O Problema e a Solução

### O Problema

A gestão de eventos, sejam eles acadêmicos, sociais ou corporativos, exige um controle rigoroso de informações como datas, locais, participantes e recursos. A ausência de um sistema centralizado e eficiente resulta em dados dispersos, dificuldade na geração de relatórios e falhas na comunicação com os usuários.

### A Solução: MyEvents

O MyEvents oferece uma plataforma integrada para resolver esses desafios. Ele permite:

*   **Cadastro e Gerenciamento de Eventos:** Criação, edição e exclusão de eventos com detalhes como nome, data, local, capacidade e muito mais!
*   **Visualização de Dados:** Um *dashboard* para visualização de gráficos e relatórios, essenciais para a tomada de decisão.
*   **Persistência Segura:** Utilização de um banco de dados relacional para garantir a integridade e a consistência dos dados.

## 💻 Implementação Técnica

O projeto foi arquitetado como uma aplicação *full-stack* moderna, dividida em três componentes principais: Frontend, Backend e Banco de Dados.

### 1. Frontend

| Tecnologia | Função |
| :--- | :--- |
| **Angular** | Framework principal para a construção da Single Page Application (SPA). |
| **TypeScript** | Garante a tipagem estática e a robustez do código do lado do cliente. |
| **HTML/CSS** | Estrutura e estilização da interface, incluindo o *dashboard* de gráficos. |

O *frontend* reside na pasta `front/` e é responsável por consumir a API do *backend* para exibir e interagir com os dados de eventos.

### 2. Backend

| Tecnologia | Função |
| :--- | :--- |
| **Java** | Linguagem principal para a lógica de negócios. |
| **Spring Boot** | Framework para o desenvolvimento rápido e robusto da API RESTful. |
| **Maven** | Gerenciamento de dependências e construção do projeto. |

O *backend*, localizado na pasta `back/`, atua como o intermediário entre o *frontend* e o banco de dados. Ele implementa a lógica de negócios, realiza a validação dos dados e expõe os *endpoints* da API para o gerenciamento de eventos.

## 💾 Foco no Aprendizado de SQL

O cerne deste projeto, como trabalho de Banco de Dados, foi a aplicação prática dos conhecimentos de SQL. A pasta `scripts/` é o ponto focal desse aprendizado.

### Conceitos de DB Aplicados:

1.  **Modelagem Relacional:** Definição do esquema do banco de dados (tabelas, colunas, tipos de dados) para representar entidades como `Evento`, `Categoria` e suas relações.
2.  **Integridade de Dados:** Uso de **Chaves Primárias** e **Chaves Estrangeiras** para impor restrições e garantir a consistência das relações.
3.  **Consultas Complexas (DQL):** O *backend* utiliza consultas feitas com SQL puro.

## 🛠️ Configuração e Execução

Para rodar o projeto localmente, siga os passos abaixo:

### Pré-requisitos

*   Java Development Kit (JDK) (versão 21 ou superior recomendada)
*   Node.js e npm (para o Angular CLI)
*   Sistema de gerenciamento de banco de dados (MySQL)

### 1. Configuração do Banco de Dados

1.  Acesse a pasta `scripts/`.
2.  Execute os scripts SQL de criação de esquema e população de dados.

### 2. Execução do Backend

1.  Navegue até a pasta `back/`.
2.  Execute o projeto Spring Boot (usando Maven ou o wrapper `mvnw`).
    ```bash
    cd back
    ./mvnw spring-boot:run
    ```
    O servidor da API estará ativo, na porta `8080`.

### 3. Execução do Frontend

1.  Navegue até a pasta `front/`.
2.  Instale as dependências e inicie o servidor de desenvolvimento Angular.
    ```bash
    cd front
    npm install
    ng serve --open
    ```
    A aplicação será aberta no seu navegador (em `http://localhost:4200/`).

## 👥 Contribuidores

Este projeto foi desenvolvido por:

*   **Carlosesposito22** (Carlos Espósito)
*   **Mateus-Ribeir0** (Mateus Ribeiro)
*   **Felipemmdo** (Felipe Marques)

## 📄 Licença

Este projeto é de código aberto e pode ser utilizado e modificado livremente.
