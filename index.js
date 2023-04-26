const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

// Config
  // Template Engine
    app.engine("handlebars", handlebars({ defaultLayout: "main" }))
    app.set("view engine", "handlebars")
  // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
  // Conexão com a base de dados
    const dbConnection = require("./backend/dbConnection");
    dbConnection();
// Rotas
  app.post("/", (req, res) => {
    res.render('formRifas')
  });

  app.get("/login", (req, res) => {
    res.render('formLogin')
  });

  app.get("/cadastro", (req, res) => {
    // :nome/:senha/:provincia/:genero
    res.render('formCadastro')
  });

  app.post('/validateCadastro', (req, res) => {
    const { nome, senha, provincia, genero } = req.body;
    // Verifica se o nome já existe na tabela
      const query = `SELECT * FROM usuarios WHERE nome = '${nome}'`;
      connection.query(query, (err, results) => {
      if (err) {
        console.log("Erro ao executar a consulta:", err);
        res.status(500).send("Erro ao executar a consulta");
        return;
      }

      if (results.length > 0) {
        res.status(400).send("Já existe um usuário com esse nome");
        return;
      }

    // Insere o novo usuário na tabela
      const query = `INSERT INTO usuarios (nome, senha, provincia, genero) VALUES ('${nome}', '${senha}', '${provincia}', '${genero}')`;
      connection.query(query, (err, results) => {
        if (err) {
          console.log("Erro ao executar a consulta:", err);
          res.status(500).send("Erro ao inserir novo usuário");
          return;
      }
      res.status(201).send("Usuário inserido com sucesso!");
      });
    });
  })

  app.listen(8081, () => {
    console.log("Servidor rodando em https://localhost:8081/");
  });
