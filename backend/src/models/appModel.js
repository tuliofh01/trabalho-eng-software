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

function getCardapio()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO`;
  let rows = db.prepare(query).all();

  if (rows.length <= 0) {
    popularItemCardapio();
    rows = db.prepare(query).all();
  }

  console.log(rows);
  return rows;
}

function popularItemCardapio()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const querySabores = `SELECT * FROM SABOR_PIZZA`;
  const rowsSabores = db.prepare(querySabores).all();
  
  for (let row in rowsSabores)
  {
    let counter = 1;
    let queryPizzas = `insert into ITEMCARDAPIO (DESCRICAO, VALOR, TIPO, IDSABOR1)
    values (?, ?, ?, ?)`;

    //random number between 20 and 100
    const valor = (Math.random() * (100 - 20) + 20).toFixed(2);
    const values = [(`Pizza de `+row.nome), valor, 'Pizza', row.ID];

    db.run(queryPizzas, values, function (error) {
      if (error) console.error(error);
    });

    let resultQuery = `SELECT * FROM ITEMCARDAPIO WHERE ID = ${counter}`;
    console.log(`New ITEMCARDAPIO inserted: `+db.prepare(resultQuery).all());
    counter++;
  }

  const queryBebidas = `insert into ITEMCARDAPIO (DESCRICAO, VALOR, TIPO)
  values ('Coca-cola', 10, 'Bebida'), ('Guaraná', 8, 'Bebida'), ('Água mineral', 5, 'Bebida')`;

  db.run(queryBebidas, function(error){
    if (error) console.error(error);
  });
    
}

module.exports = {
  criarConta: criarConta,
  criarEndereco: criarEndereco,
  autenticarLogin: autenticarLogin,
  getBairros: getBairros,
  getDadosPerfil: getDadosPerfil,
  getEndereco: getEndereco,
  getBairro: getBairro
};
