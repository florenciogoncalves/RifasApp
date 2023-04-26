const dbConnection = require('./dbConnection');

// Verifica se o nome completo já está cadastrado
User.findOne({ where: { nome_completo: req.body.nome_completo } })
  .then(user => {
    if (user) {
      res.status(400).json({ error: 'Nome completo já cadastrado' });
    } else {
      // Cadastra o usuário
      User.create({
        nome_completo: req.body.nome_completo,
        senha: req.body.senha,
        provincia: req.body.provincia,
        genero: req.body.genero
      })
      .then(() => {
        res.status(201).json({ message: 'Usuário cadastrado com sucesso' });
      })
      .catch(error => {
        res.status(500).json({ error: error.message });
      });
    }
  })
  .catch(error => {
    res.status(500).json({ error: error.message });
  });
