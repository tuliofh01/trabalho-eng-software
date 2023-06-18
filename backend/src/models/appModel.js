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
  getBairros: getBairros
};
