const dbConnection = function () {
const mysql = require("mysql");

// Configuração do banco de dados
	const connection = mysql.createConnection({
		host: "localhost",
		user: "root",
		password: "",
		database: "rifasApp",
	});
// Conexão com o banco de dados
	connection.connect((err) => {
		if (err) {
			console.log("Erro ao conectar com o banco de dados:", err);
			return;
		}
		console.log("Conexão com o banco de dados bem sucedida!");
	});
};

module.exports = dbConnection;
