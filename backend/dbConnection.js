const mysql = require("mysql")
const dbConnection = {
  // Configuração do banco de dados
  connection: mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'rifasApp',
  }),
  // Conexão com o banco de dados
  testConnection: function() {
    this.connection.connect((err) => {
      if (err) {
        console.log('Erro ao conectar com o banco de dados:', err);
        return;
      }
      console.log('Conexão com o banco de dados bem sucedida!');
    });
  },
};

module.exports = dbConnection;
