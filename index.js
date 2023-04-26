const express = require("express");
const app = express();
const handlebars = require('express-handlebars')
const bodyParser = require('body-parser')

// Config
    app.use(express.static('public'));
  // Template Engine
    app.engine("handlebars", handlebars({ defaultLayout: "main" }))
    app.set("view engine", "handlebars")
  // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
  // Conexão com a base de dados
    const dbConnection = require("./backend/dbConnection");
    dbConnection.testConnection();
// Rotas
  app.post("/", (req, res) => {
    res.render('formRifas')
  });

  app.get("/login", (req, res) => {
    res.render('formLogin')
  });

  app.post('/validateLogin', (req, res) => {
    const { nome, senha } = req.body
    // Realiza a consulta no banco de dados
      dbConnection.connection.query(`SELECT * FROM usuarios WHERE nome='${nome}'`, (err, rows) => {
        if (err) {
          console.error('Erro ao realizar a consulta: ', err);
          res.status(500).send('Erro ao realizar a consulta.');
        } else {
          // Verifica se o usuário foi encontrado
          if (rows.length > 0) {
            const usuario = rows[0];

            // Verifica se a senha está correta
            if (usuario.senha === senha) {
              res.redirect('/')
            } else {
              res.status(401).send('Senha incorreta.');
            }
          } else {
            res.status(401).send('Usuário não encontrado.');
          }
        }
      });
  })

  app.get("/cadastro", (req, res) => {
    // :nome/:senha/:provincia/:genero
    res.render('formCadastro')
  });

  app.post('/validateCadastro', (req, res) => {
    const { nome, senha, provincia, genero } = req.body;
    // Verifica se o nome já existe na tabela
      const query = `SELECT * FROM usuarios WHERE nome = '${nome}'`;
      dbConnection.connection.query(query, (err, results) => {
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
      const query = `INSERT INTO usuarios (nome, senha, provincia, genero, createdAt, updatedAt) VALUES ('${nome}', '${senha}', '${provincia}', '${genero}', NOW(), NOW())`;
      dbConnection.connection.query(query, (err, results) => {
        if (err) {
          console.log("Erro ao executar a consulta:", err);
          res.status(500).send("Erro ao inserir novo usuário");
          return;
      }
      res.status(201).redirect('/');
      });
    });
  })

  app.listen(8081, () => {
    console.log("Servidor rodando em https://localhost:8081/");
  });
