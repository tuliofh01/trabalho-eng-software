const sqlite3 = require("sqlite3");
const path = require("path");

function autenticarLogin(user, password) {
  const db = new sqlite3.Database('../assets/database.db');

  let usersArray = [];

   db.all(`SELECT * FROM USUARIOS`, (error, rows) => {
    if (error) {
      console.error(error);
    } else {
      usersArray = rows;
      console.log(rows)
    }
  });

  db.close();

  //console.log(usersArray)

  if (usersArray[0].length > 0) {
    return true;
  } else {
    return false;
  }
}

function criarConta(accountData){
  const dbPath = path.resolve(__dirname, "../assets/database.db");

  const db = new sqlite3.Database(dbPath);

  const query = "INSERT INTO USUARIO (CPF, NOME, TELEFONE, EMAIL, SENHA, ENDERECO) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [accountData.cpf, accountData.nome, accountData.telefone,
    accountData.email, accountData.senha, accountData.endereco];

  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`New USER inserted: ${accountData.cpf}`);
    }
  });

  db.close()
}

function criarEndereco(accountData){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  
  const db = new sqlite3.Database(
    dbPath
  );

  const query = "INSERT INTO ENDERECO (ID, LOGRADOURO, BAIRRO, CEP) VALUES (?, ?, ?, ?)";
  const values = [accountData.id, accountData.logradouro, accountData.bairro, accountData.cep];

  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`New ADDRESS inserted: ${accountData.id}`);
    }
  });

  db.close()
}

module.exports = {
  criarConta: criarConta,
  criarEndereco: criarEndereco,
  autenticarLogin: autenticarLogin,
};
