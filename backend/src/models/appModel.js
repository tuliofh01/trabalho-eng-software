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
  return rows;
}

function getItemCardapioImage(descricao)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE DESCRICAO = '${descricao}'`;

  let rows = db.prepare(query).get();

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

/*function getItemCardapioId(description){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT ID FROM ITEMCARDAPIO WHERE DESCRICAO = '${description}'`;
  let rows = db.prepare(query).all();
  return rows;
}*/

function getMenuItem(id){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM ITEMCARDAPIO WHERE ID = ${id}`;
  const row = db.prepare(query).get();
  return row;
}

function insertNewPizzaPersonalizada(sabor1Id, sabor2Id, valor){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const sabor1Desc = db.prepare(`SELECT DESCRICAO FROM SABOR_PIZZA WHERE ID = ${sabor1Id}`).get()['DESCRICAO'];
  const sabor2Desc = db.prepare(`SELECT DESCRICAO FROM SABOR_PIZZA WHERE ID = ${sabor2Id}`).get()['DESCRICAO'];

  const querySearch = `SELECT * FROM ITEMCARDAPIO WHERE IDSABOR1 = ${sabor1Id} and IDSABOR2 = ${sabor2Id}`;

  let row = db.prepare(querySearch).get();

  if (row == null)
  {
    const queryInsert = `INSERT INTO ITEMCARDAPIO (DESCRICAO, VALOR, TIPO, IDSABOR1, IDSABOR2)
                         VALUES (?, ?, ?, ?, ?)`;

    const info = db.prepare(queryInsert).run(`Pizza Dois Sabores de ${sabor1Desc} + ${sabor2Desc}`, valor, 'Pizza', sabor1Id, sabor2Id);
    row = db.prepare(`SELECT * FROM ITEMCARDAPIO WHERE ID = ${info.lastInsertRowid}`).get();
  }
  //console.log(row);
  return row;
}

function registerItemOrder(idPedido, idItem, qtde){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  let result;


  //Primeiro, verificar se o item já se encontra na base para o ID do pedido
  const selectQuery = `select * from ITEMPEDIDO where IDPEDIDO = ${idPedido} and IDITEM = ${idItem}`;
  const row = db.prepare(selectQuery).get();

  if (row == null)
  {
    // Prepare the INSERT statement
    const insertStmt = db.prepare(
      "INSERT INTO ITEMPEDIDO (IDPEDIDO, IDITEM, QUANTIDADE) VALUES (?, ?, ?)"
    );
    const idDoPedido = Number(idPedido);
    const idDoItem = Number(idItem);
    const quantidade = Number(qtde);
    // Execute the INSERT statement
    result = insertStmt.run(idDoPedido, idDoItem, quantidade);
    // Close the database connection

  } else {
    const updateQuery = `update ITEMPEDIDO set QUANTIDADE = ? where IDPEDIDO = ? AND IDITEM = ?`;
    result = db.prepare(updateQuery).run(Number(row.QUANTIDADE) + Number(qtde), idPedido, idItem);    
  }

  db.close();
  return result;
}

function getPedidosUsuario(cpf)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const rows = db.prepare(
      `SELECT * FROM PEDIDO WHERE CPF = '${cpf}'`
    ).all();

  return rows;

}

function getOrderItems(idPedido)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const rows = db.prepare(
      `SELECT * FROM ITEMPEDIDO WHERE IDPEDIDO = '${idPedido}'`
    ).all();

  return rows;
}

function getCartOrderItems(cpf)
{
  const order = getOrderCart(cpf);
  const rows = getOrderItems(order.ID);

  return rows;
}

function setPedido(data){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  // Prepare the INSERT statement
  const insertStmt = db.prepare(
    "INSERT INTO PEDIDO (CPF, IDENDERECO, VALORTOTAL, STATUSPEDIDO, DATAHORA) VALUES (?, ?, ?, ?, ?)"
  );
  // Execute the INSERT statement
  const result = insertStmt.run(data.cpf, data.endereco, data.valor, data.status, data.dataHora);

  // Close the database connection
  db.close();

  return result.lastInsertRowid;
}

function registerOrder(data){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  console.log(data);
  
  const updateStmt = db.prepare(
    `UPDATE PEDIDO SET CPF = ?, IDENDERECO = ?, STATUSPEDIDO = ?, DATAHORA = ?
     where ID = ?`
  );

  const result = updateStmt.run(data.cpf, data.endereco, data.status, data.dataHora, data.id);

  // Close the database connection
  db.close();

  return result;
}

function getUserData(username){
  const email = username;
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${email}'`;
  let rows = db.prepare(query).get();
  return rows;
}

function getUserDataCPF(cpf){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE CPF = '${cpf}'`;
  const row = db.prepare(query).get();
  return row;
}

function getItensMaisPedidos(){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  const query = `select * from ITEMCARDAPIO 
                 left join ITEMPEDIDO on ITEMCARDAPIO.ID = ITEMPEDIDO.IDITEM
                 group by ITEMCARDAPIO.ID order by sum(QUANTIDADE) desc;`;

  const rows = db.prepare(query).all();

  return(rows);
}

function createCartOrder(cpf)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const endereco = getUserDataCPF(cpf).IDENDERECO;
  const queryInsert = `insert into PEDIDO (CPF, STATUSPEDIDO, IDENDERECO)
                       values ('${cpf}', 'NÃO CONCLUÍDO', '${endereco}')`;

  const info = db.prepare(queryInsert).run();
  row = db.prepare(`SELECT * FROM ITEMCARDAPIO WHERE ID = ${info.lastInsertRowid}`).get();       
  console.log("createCartOrder");  
  console.log(row);     
  return row;
}

function getCartOrder(cpf)
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  const query = `select * from PEDIDO where CPF = ${cpf} and STATUSPEDIDO = 'NÃO CONCLUÍDO'`;

  let row = db.prepare(query).get();
  console.log("getCartOrder");  
  console.log(row);    
  return row;
}
function setUserData(data){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  // Prepare the INSERT statement
  const insertStmt = db.prepare(
    "UPDATE USUARIO SET CPF = ?, NOME = ?, TELEFONE = ? WHERE EMAIL = ?"
  );
  // Execute the INSERT statement
  const result = insertStmt.run(
    data.cpf,
    data.nome,
    data.telefone,
    data.email
  );

  // Close the database connection
  db.close();
}

function setAddressData(data){
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);
  // Prepare the INSERT statement
  const insertStmt = db.prepare(
    "UPDATE ENDERECO SET CEP = ?, IDBAIRRO = ?, LOGRADOURO = ? WHERE ID = ?"
  );
  // Execute the INSERT statement
  const result = insertStmt.run(data.cep, data.idBairro, data.logradouro, data.idEndereco);

  // Close the database connection
  db.close();
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
  insertNewPizzaPersonalizada: insertNewPizzaPersonalizada,
  registerItemOrder: registerItemOrder,
  getUserData: getUserData,
  getPedidosUsuario: getPedidosUsuario,
  setPedido: setPedido,
  getItensMaisPedidos: getItensMaisPedidos,
  createCartOrder: createCartOrder,
  getCartOrder: getCartOrder,
  getOrderItems: getOrderItems,
  getUserDataCPF: getUserDataCPF,
  registerOrder: registerOrder,
  getMenuItem: getMenuItem,
  setUserData: setUserData,
  setAddressData: setAddressData
}
