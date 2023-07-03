const sqlite3 = require("sqlite3").verbose();
const Database = require("better-sqlite3");
const path = require("path");
require('dotenv').config();
const dbPath = path.resolve(__dirname, process.env.DATABASE_PATH);



function authLogin(user, password) {
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${user}' AND SENHA = '${password}'`;
  const rows = db.prepare(query).all();
  db.close();
  return (rows.length > 0)
}

function createAccount(accountData){
  const db = new sqlite3.Database(dbPath);
  const query = "INSERT INTO USUARIO (CPF, NOME, TELEFONE, EMAIL, SENHA, IDENDERECO) VALUES (?, ?, ?, ?, ?, ?)";
  const values = [accountData.cpf, accountData.nome, accountData.telefone,
    accountData.email, accountData.senha, accountData.endereco["ID"]];

  const result = db.run(query, values, function (error) {
    if (error) {
      console.error(error);
    } else {
      console.log(`New USER inserted: ${accountData.cpf}`);
    }
  });

  db.close();
}

function criarEndereco(addressData) {
  const db = new Database(dbPath);

  // Get bairro ID
  const query = `SELECT ID FROM BAIRRO WHERE NOME = ?`;
  const row = db.prepare(query).get(addressData.bairro);
  const idBairro = row ? row.ID : null;
  console.log(idBairro);

  // Insert address
  const insertQuery =
    "INSERT INTO ENDERECO (LOGRADOURO, IDBAIRRO, CEP, NUMERO) VALUES (?, ?, ?, ?)";
  const stmt = db.prepare(insertQuery);
  const result = stmt.run(addressData.logradouro, idBairro, addressData.cep, addressData.numero);
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
  const db = new Database(dbPath);
  const query = `SELECT * FROM BAIRRO`;
  const rows = db.prepare(query).all();
  const nomes = rows.map(obj => obj.NOME);
  db.close();
  return nomes;
}

function getDadosPerfil(username){
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${username}'`;
  const rows = db.prepare(query).all();
  db.close();
  return rows;
}

function getNeighborhoodData(id) {
  const db = new Database(dbPath);
  const query = `SELECT NOME AS NOMEBAIRRO FROM BAIRRO WHERE ID = '${id}'`;
  const row = db.prepare(query).get();
  db.close();

  return row;
}

function getAddressData(id){
  const db = new Database(dbPath);
  const query = `SELECT E.LOGRADOURO, E.IDBAIRRO, E.ID, E.NUMERO, B.NOME AS NOMEBAIRRO, E.CEP FROM ENDERECO E
                 JOIN BAIRRO B ON E.IDBAIRRO = B.ID 
                 WHERE E.ID = '${id}'`;
  const row = db.prepare(query).get();
  db.close();

  return row;
}

function getSaboresPizza()
{
  const db = new Database(dbPath);
  const query = `SELECT * FROM SABOR_PIZZA`;
  const rows = db.prepare(query).all();
  db.close();

  return rows;
}

function getItemCardapioImage(descricao)
{
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE DESCRICAO = '${descricao}'`;

  let rows = db.prepare(query).get();
  db.close();

  return rows.IMAGEM_PATH;
}

function getPizzas()
{
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Pizza'`;
  let rows = db.prepare(query).all();
  db.close();

  return rows;
}

function getCombos()
{
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Combo'`;
  let rows = db.prepare(query).all();
  db.close();
  
  return rows;
}

function getBebidas()
{
  const db = new Database(dbPath);

  const query = `SELECT * FROM ITEMCARDAPIO WHERE TIPO = 'Bebida'`;
  let rows = db.prepare(query).all();  
  db.close();

  return rows;
}

function getMenuItem(id){
  const db = new Database(dbPath);
  const query = `SELECT * FROM ITEMCARDAPIO WHERE ID = ${id}`;
  const row = db.prepare(query).get();
  db.close();

  return row;
}

function getDoubleFlavorPizza(sabor1Id, sabor2Id, valor){
  const db = new Database(dbPath);

  const sabor1Desc = db.prepare(`SELECT DESCRICAO FROM SABOR_PIZZA WHERE ID = ${sabor1Id}`).get()['DESCRICAO'];
  const sabor2Desc = db.prepare(`SELECT DESCRICAO FROM SABOR_PIZZA WHERE ID = ${sabor2Id}`).get()['DESCRICAO'];

  const querySearch = `select * from ITEMCARDAPIO 
                       where (IDSABOR1 = ${sabor1Id} and IDSABOR2 = ${sabor2Id})
                       or (IDSABOR2 = ${sabor1Id} and IDSABOR1 = ${sabor2Id})`;

  let row = db.prepare(querySearch).get();

  if (row == null)
  {
    const queryInsert = `INSERT INTO ITEMCARDAPIO (DESCRICAO, VALOR, TIPO, IDSABOR1, IDSABOR2, IMAGEM_PATH)
                         VALUES (?, ?, ?, ?, ?, ?)`;

    try {
      const info = db.prepare(queryInsert).run(`Pizza Dois Sabores de ${sabor1Desc} + ${sabor2Desc}`, valor, 'Pizza', sabor1Id, sabor2Id, '../frontend/src/assets/pizzas/pizzaPersonalizada.png');
      row = db.prepare(`SELECT * FROM ITEMCARDAPIO WHERE ID = ${info.lastInsertRowid}`).get();
      
    } catch(error) {
      return({code: error["code"], message: error["message"]});
    }
  }

  db.close();
  return row;
}

function registerItemOrder(idPedido, idItem, qtde){
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
    try {
      result = insertStmt.run(idDoPedido, idDoItem, quantidade);
    } catch (error) {
      return({code: error["code"], message: error["message"]});
    }
    // Close the database connection

  } else {
    const updateQuery = `update ITEMPEDIDO set QUANTIDADE = ? where IDPEDIDO = ? AND IDITEM = ?`;
    try {
      result = db.prepare(updateQuery).run(Number(row.QUANTIDADE) + Number(qtde), idPedido, idItem);    
    } catch(error)
    {
      return({code: error["code"], message: error["message"]});
    }
  }

  db.close();
  return result;
}

function getOrder(idPedido)
{
  const db = new Database(dbPath);

  const row = db.prepare(
      `SELECT * FROM PEDIDO WHERE ID = '${idPedido}'`
    ).get();

  db.close();
  return row;
}

function getPedidosUsuario(cpf)
{
  const db = new Database(dbPath);

  const rows = db.prepare(
      `SELECT * FROM PEDIDO WHERE CPF = '${cpf}'`
    ).all();

  db.close();
  return rows;
}

function getOrderItems(idPedido)
{
  const db = new Database(dbPath);

  const rows = db.prepare(
      `SELECT * FROM ITEMPEDIDO IP 
       JOIN ITEMCARDAPIO IC ON IC.ID = IP.IDITEM
       WHERE IDPEDIDO = '${idPedido}'`
    ).all();

  db.close();
  return rows;
}

function setPedido(data){
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
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE EMAIL = '${email}'`;
  let rows = db.prepare(query).get();
  db.close();

  return rows;
}

function getUserDataCPF(cpf){
  const db = new Database(dbPath);
  const query = `SELECT * FROM USUARIO WHERE CPF = '${cpf}'`;
  const row = db.prepare(query).get();
  db.close();

  return row;
}

function getItensMaisPedidos(){
  const db = new Database(dbPath);

  const query = `select * from ITEMCARDAPIO 
                 left join ITEMPEDIDO on ITEMCARDAPIO.ID = ITEMPEDIDO.IDITEM
                 group by ITEMCARDAPIO.ID order by sum(QUANTIDADE) desc;`;

  const rows = db.prepare(query).all();
  db.close();

  return(rows);
}

function createCartOrder(cpf)
{
  const db = new Database(dbPath);
  const endereco = getUserDataCPF(cpf).IDENDERECO;
  const queryInsert = `insert into PEDIDO (CPF, STATUSPEDIDO, IDENDERECO)
                       values ('${cpf}', 'NÃO CONCLUÍDO', '${endereco}')`;

  const info = db.prepare(queryInsert).run();
  row = db.prepare(`SELECT * FROM ITEMCARDAPIO WHERE ID = ${info.lastInsertRowid}`).get();       
  db.close();

  return row;
}

function getCartOrder(cpf)
{
  const db = new Database(dbPath);
  const query = `select * from PEDIDO where CPF = ${cpf} and STATUSPEDIDO = 'NÃO CONCLUÍDO'`;

  let row = db.prepare(query).get();
  db.close();

  return row;
}

function setUserData(data){
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

function setAddressData(data) {
  const db = new Database(dbPath);
  
  console.log(data)
  const query = `UPDATE ENDERECO SET CEP = '${data.cep}', IDBAIRRO = ${data.idBairro}, LOGRADOURO = '${data.logradouro}', NUMERO = ${data.numero} WHERE ID = ${data.idEndereco}`;
  console.log(query)

  try {
    const insertStmt = db.prepare(
      `UPDATE ENDERECO SET CEP = '${data.cep}', IDBAIRRO = ${data.idBairro}, LOGRADOURO = '${data.logradouro}', NUMERO = ${data.numero} WHERE ID = ${data.idEndereco}`
    );

    console.log(insertStmt)

    const result = insertStmt.run(
    );

    console.log(result);
  } catch (error) {
    console.error(error);
  } finally {
    db.close();
  }
}


function getNeighborhoodId(nome){
  const db = new Database(dbPath);
  const query = `select ID from BAIRRO where NOME = '${nome}'`;
  let row = db.prepare(query).get();
  db.close();
  return row["ID"];
}

function deleteOrder(idPedido)
{
  const db = new Database(dbPath);

  const row = db.prepare(
      `delete from PEDIDO where ID = '${idPedido}'`
    ).get();

  db.close();
  return row;
}


module.exports = {
  createAccount: createAccount,
  criarEndereco: criarEndereco,
  authLogin: authLogin,
  getBairros: getBairros,
  getDadosPerfil: getDadosPerfil,
  getAddressData: getAddressData,
  getNeighborhoodData: getNeighborhoodData,
  getPizzas: getPizzas,
  getCombos: getCombos,
  getBebidas: getBebidas,
  getSaboresPizza: getSaboresPizza,
  getItemCardapioImage: getItemCardapioImage,
  getDoubleFlavorPizza: getDoubleFlavorPizza,
  registerItemOrder: registerItemOrder,
  getUserData: getUserData,
  getPedidosUsuario: getPedidosUsuario,
  getOrder: getOrder,
  setPedido: setPedido,
  getItensMaisPedidos: getItensMaisPedidos,
  createCartOrder: createCartOrder,
  getCartOrder: getCartOrder,
  getOrderItems: getOrderItems,
  getUserDataCPF: getUserDataCPF,
  registerOrder: registerOrder,
  getMenuItem: getMenuItem,
  setUserData: setUserData,
  setAddressData: setAddressData,
  getNeighborhoodId: getNeighborhoodId,
  deleteOrder: deleteOrder
}
