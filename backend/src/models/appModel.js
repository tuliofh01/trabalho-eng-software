const sqlite3 = require("sqlite3").verbose();
const Database = require("better-sqlite3");
const path = require("path");

function autenticarLogin(user, password) {
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${user}' AND SENHA = '${password}'`;
  const rows = db.prepare(query).all();
  db.close();
  return (rows.length > 0)
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

function criarEndereco(addressData){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  let db = new sqlite3.Database(
    dbPath
  );
  
  // Inserts address
  let query = "INSERT INTO ENDERECO (LOGRADOURO, BAIRRO, CEP) VALUES (?, ?, ?)";
  const values = [
    addressData.logradouro,
    addressData.bairro,
    addressData.cep,
  ];
  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`New ADDRESS inserted: ${addressData.logradouro}`);
    }
  });
  db.close()

  // Gets address id
  db = new Database(dbPath);
  query = `SELECT * FROM ENDERECO WHERE LOGRADOURO = '${addressData.logradouro}' 
    AND BAIRRO = '${addressData.bairro}' AND CEP ='${addressData.cep}'`;
  const rows = db.prepare(query).all();
  console.log(rows[0]["ID"]);
  return rows[0]["ID"];
}

module.exports = {
  criarConta: criarConta,
  criarEndereco: criarEndereco,
  autenticarLogin: autenticarLogin,
};
