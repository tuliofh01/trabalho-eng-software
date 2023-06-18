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
  const query = "INSERT INTO USUARIO (CPF, NOME, TELEFONE, EMAIL, SENHA, IDENDERECO) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [accountData.cpf, accountData.nome, accountData.telefone,
    accountData.email, accountData.senha, accountData.endereco["ID"]];
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
  // Get bairro ID
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  let db = new Database(dbPath);
  let query = `SELECT ID FROM BAIRRO WHERE NOME = '${addressData.bairro}'`;
  let rows = db.prepare(query).all();
  db.close();
  const idBairro = rows[0]["ID"]
  console.log(idBairro)

  // Inserts address
  db = new sqlite3.Database(dbPath);
  query =
    "INSERT INTO ENDERECO (LOGRADOURO, IDBAIRRO, CEP) VALUES (?, ?, ?)";
  const values = [addressData.logradouro, idBairro, addressData.cep];
  db.run(query, values, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`New ADDRESS inserted: ${addressData.logradouro}`);
    }
  });
  db.close();

  // Gets address id
  db = new Database(dbPath);
  query = `SELECT ID FROM ENDERECO WHERE LOGRADOURO = '${addressData.logradouro}' 
    AND IDBAIRRO = '${idBairro}' AND CEP ='${addressData.cep}'`;
  rows = db.prepare(query).all();
  return rows[0];
}


function getBairros(){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM BAIRRO`;
  const rows = db.prepare(query).all();
  const nomes = rows.map(obj => obj.NOME);
  console.log(nomes)
  return nomes;
}


module.exports = {
  criarConta: criarConta,
  criarEndereco: criarEndereco,
  autenticarLogin: autenticarLogin,
  getBairros: getBairros
};
