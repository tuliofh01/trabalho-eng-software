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

function criarEndereco(addressData) {
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  // Get bairro ID
  const query = `SELECT ID FROM BAIRRO WHERE NOME = ?`;
  const row = db.prepare(query).get(addressData.bairro);
  const idBairro = row ? row.ID : null;
  console.log(idBairro);

  // Insert address
  const insertQuery =
    "INSERT INTO ENDERECO (LOGRADOURO, IDBAIRRO, CEP) VALUES (?, ?, ?)";
  const stmt = db.prepare(insertQuery);
  const result = stmt.run(addressData.logradouro, idBairro, addressData.cep);
  if (result.changes > 0) {
    console.log(`New ADDRESS inserted: ${addressData.logradouro}`);
  }

  // Get address ID
  const selectQuery = `SELECT ID FROM ENDERECO WHERE LOGRADOURO = ? AND IDBAIRRO = ? AND CEP = ?`;
  const addressRow = db
    .prepare(selectQuery)
    .get(addressData.logradouro, idBairro, addressData.cep);
  console.log(addressRow);

  db.close();

  return addressRow;
}

function getBairros(){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM BAIRRO`;
  const rows = db.prepare(query).all();
  const nomes = rows.map(obj => obj.NOME);
  return nomes;
}

function getDadosPerfil(username){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${username}'`;
  const rows = db.prepare(query).all();
  return rows;
}

function getEndereco(id){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM ENDERECO WHERE ID = '${id}'`;
  const rows = db.prepare(query).all();
  return rows;
}

function getBairro(id) {
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT NOME FROM BAIRRO WHERE ID = '${id}'`;
  const rows = db.prepare(query).all();
  return rows;
}
function getSaboresPizza()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM SABOR_PIZZA`;
  const rows = db.prepare(query).all();
  const nomes = rows.map(obj => obj.NOME);
  return nomes;
}

/*function getCardapio()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO`;
  let rows = db.prepare(query).all();

  if (rows.length <= 0) {
    popularItemCardapio();
    rows = db.prepare(query).all();
  }

  return rows;
}*/

function getItemCardapioImage(descricao)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE DESCRICAO = '${descricao}'`;

  let rows = db.prepare(query).get();

  console.log(rows.IMAGEM_PATH);

  return rows.IMAGEM_PATH;
}

function getPizzas()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Pizza'`;
  let rows = db.prepare(query).all();
  return rows;
}

function getCombos()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Combo'`;
  let rows = db.prepare(query).all();
  
  return rows;
}

function getBebidas()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Bebida'`;
  let rows = db.prepare(query).all();

  return rows;
}

function getItemCardapioId(description){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT ID FROM ITEMCARDAPIO WHERE DESCRICAO = '${description}'`;
  let rows = db.prepare(query).all();
  return rows;
}

function getItemCardapioDescription(id){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT DESCRICAO FROM ITEMCARDAPIO WHERE ID = '${id}'`;
  let rows = db.prepare(query).all();
  return rows;
}

module.exports = {
  criarConta: criarConta,
  criarEndereco: criarEndereco,
  autenticarLogin: autenticarLogin,
  getBairros: getBairros,
  getDadosPerfil: getDadosPerfil,
  getEndereco: getEndereco,
  getBairro: getBairro,
  getPizzas: getPizzas,
  getCombos: getCombos,
  getBebidas: getBebidas,
  getSaboresPizza: getSaboresPizza,
  getItemCardapioImage: getItemCardapioImage,
  getItemCardapioId: getItemCardapioId,
  getItemCardapioDescription: getItemCardapioDescription
};
