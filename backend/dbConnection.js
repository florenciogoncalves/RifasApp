const dbConnection = function () {
	const Sequelize = require("sequelize");
	const sequelize = new Sequelize("rifasApp", "root", "", {
		host: "localhost",
		dialect: "mysql",
	});

	sequelize
		.authenticate()
		.then(function () {
			console.log("Conectado com sucesso a base de dados!");
		})
		.catch(function (erro) {
			console.log("Falha ao se conectar a base de dados!" + erro);
		});

	// Define as tabelas de menu por província
	function setMenu(menu) {
		const Menus = sequelize.define('menu_' + menu, {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			nome: {
				type: Sequelize.TEXT,
			},
			genero: {
				type: Sequelize.STRING,
			},
      escolhido: {
        type: Sequelize.BOOLEAN
      }
		});
		Menus.sync({ force: true });
	}

  setMenu('luanda')
  setMenu('saurimo')

  const Usuarios = sequelize.define('usuarios', {
			id: {
				type: Sequelize.INTEGER,
				primaryKey: true,
			},
			nome: {
				type: Sequelize.TEXT,
			},
      passe: {
        type: Sequelize.STRING
      },
			provincia: {
				type: Sequelize.STRING,
			},
			genero: {
				type: Sequelize.STRING,
			},
      selecionou: {
        type: Sequelize.INTEGER
      }
		});
		Usuarios.sync({ force: true });

		const setUser = function(nome, passe, provincia, genero) {
			Usuarios.create( {
				nome: nome,
				passe: passe,
				provincia: provincia,
				genero: genero,
				selecionou: false	
			})
		}
};

module.exports = dbConnection;
