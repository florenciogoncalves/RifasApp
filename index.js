// Carregando módulos
  const express = require("express");
  const app = express();
  const handlebars = require('express-handlebars')
  const bodyParser = require('body-parser')
  const path = require('path');
  const session = require('express-session');
  const flash = require('connect-flash');
// Configurações
  app.use(session({
    secret: 'rifas',
    resave: true,
    saveUninitialized: true
  }))
  app.use(flash())
  // Middleware
    app.use((req, res, next) => {
      res.locals.success_msg = req.flash('success_msg')
      res.locals.error_msg = req.flash('error_msg')
      next()
    })
  // Template Engine
    app.engine("handlebars", handlebars({ defaultLayout: "main" }))
    app.set("view engine", "handlebars")
  // Body Parser
    app.use(bodyParser.urlencoded({extended: false}))
    app.use(bodyParser.json())
  // Conexão com a base de dados
    const dbConnection = require("./backend/dbConnection");
    dbConnection.testConnection();
  // Public
    app.use(express.static(path.join(__dirname, 'public')));
// Rotas
  app.get("/", (req, res) => {
    // Verificar se o usuário está autenticado
    dbConnection.connection.query(`SELECT * FROM usuarios WHERE nome = '${req.session.nome}'`, (err, rows) => {
      if(rows[0].selecionou && req.session.autenticado) return res.redirect('/suaRifa')
      else if (req.session.autenticado ) {
        // Usar as credenciais do usuário para exibir conteúdo personalizado na página principal
        const nome = req.session.nome;
        const provincia = req.session.provincia == 'L' ? 'Luanda' : 'Saurimo'
        const genero = req.session.genero == 'M' ? 'Masculino' : 'Feminino'
        const rifas = [];
        // Consulte a tabela selecionada
          dbConnection.connection.query(`SELECT * FROM menu_luandas`, (err, rows) => {
          if (err) {
            console.log(err);
            return res.sendStatus(500);
          }
        // Crie um array de objetos com as chaves `id` e `nome`
          for (const row of rows) {
            if (!row.escolhido)
              rifas.push({ idPrato: row.id, nomePrato: row.nome });
          }

          res.render('formRifas', { nome: nome, genero: genero == 'M' ? 'Masculino' : 'Feminino', provincia: provincia == 'L' ? 'Luanda' : 'Lunda-Sul', rifas });
        });
      } else {
        res.redirect('/login');
      }
    })
    
    
  });
  app.post('/validateSelecao', (req, res) => {
    const { id } = req.body
    dbConnection.connection.query(`SELECT * FROM usuarios WHERE usuarios.nome = '${req.session.nome}'`, (err, rows) => {
      if(!rows[0].selecionou > 0) {
        dbConnection.connection.query(`UPDATE usuarios SET selecionou = ${id} WHERE usuarios.nome = '${req.session.nome}'`)
        dbConnection.connection.query(`UPDATE menu_luandas SET escolhido = 1 WHERE menu_luandas.id = ${id}`)
        return res.redirect('/suaRifa')
      }
      else return res.render('rifa', {erro: 'Você já havia feito uma escolha', nome: req.session.nome, genero: req.session.genero, provincia: req.session.provincia})
    })
    
  })
  app.get('/suaRifa', (req, res) => {
  dbConnection.connection.query(`SELECT * FROM usuarios WHERE nome='${req.session.nome}'`, (errr, rowss) => {
    dbConnection.connection.query(`SELECT * FROM menu_luandas WHERE id='${rowss[0].selecionou}'`, (err, rows) => { 
      return res.render('rifa', {rifaID: rows[0].id, rifaNome: rows[0].nome, nome: req.session.nome, genero: req.session.genero == 'M' ? 'Masculino' : 'Feminino', provincia: req.session.provincia == 'L' ? 'Luanda' : 'Lunda-Sul'});
    });
  })
    
  })
  app.get("/login", (req, res) => {
    res.render('formLogin')
  });
  app.post('/validateLogin', (req, res) => {
  const { nome, senha } = req.body
  const erros = []
  // Realiza a consulta no banco de dados
  dbConnection.connection.query(`SELECT * FROM usuarios WHERE nome='${nome}'`, (err, rows) => {
    if (err) {
      erros.push({texto: 'Erro ao realizar a consulta.'});
    } else {
      // Verifica se o usuário foi encontrado
      if (rows.length > 0) {
        const usuario = rows[0];

        // Verifica se a senha está correta
        if (usuario.senha === senha) {
          req.session.autenticado = true;
          req.session.nome = nome;
          req.session.provincia = usuario.provincia
          req.session.genero = usuario.genero
          if (usuario.selecionou) return res.redirect('/suaRifa') 
          else return res.redirect('/')
        } else {
          erros.push({texto: 'Senha incorreta.'});
        }
      } else {
        erros.push({texto: 'Usuário não encontrado.'});
      }
    }
    
    // Renderiza a página com os erros, dentro do callback da consulta
    return res.render('formLogin', { erros: erros });
  });
});
  app.get("/cadastro", (req, res) => {
    res.render('formCadastro')
  });
  app.post('/validateCadastro', (req, res) => {
    const { nome, senha, provincia, genero } = req.body;
    const erros = [];

    // Verifica se o nome já existe na tabela
    const query = `SELECT * FROM usuarios WHERE nome = '${nome}'`;
    dbConnection.connection.query(query, (err, results) => {
      if (err) {
        erros.push({texto: 'Erro ao executar a consulta'});
        return res.render('formCadastro', {erros: erros});
      }

      if (results.length > 0) {
        erros.push({texto: "Já existe um usuário com esse nome"});
        return res.render('formCadastro', {erros: erros});
      }

      // Insere o novo usuário na tabela
      const queryInsert = `INSERT INTO usuarios (nome, senha, provincia, genero, createdAt, updatedAt) VALUES ('${nome}', '${senha}', '${provincia}', '${genero}', NOW(), NOW())`;
      dbConnection.connection.query(queryInsert, (err, results) => {
        if (err) {
          erros.push({texto: "Erro ao inserir novo usuário"});
          return res.render('formCadastro', {erros: erros});
        }

        req.session.autenticado = true;
        req.session.nome = nome;
        req.session.provincia = provincia
        req.session.genero = genero
        res.redirect('/')
        
      });
    });
    
  });

//Outros
  app.listen(8081, () => {
    console.log("Servidor rodando em https://localhost:8081/");
  });
