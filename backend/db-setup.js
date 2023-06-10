async function dbSetup(){
  const sqlite3 = require("sqlite3").verbose();
  const path = require("path");

  const dbPath = path.join(__dirname, "../assets/database.db");

  // Creating tables
  const db = new sqlite3.Database(dbPath);
  
  db.run(`CREATE TABLE IF NOT EXISTS BAIRRO (
  ID INTEGER PRIMARY KEY AUTO INCREMENT NOT NULL, 
  NOME TEXT NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS ENDERECO (
  ID_USUARIO INTEGER PRIMARY KEY NOT NULL, 
  RUA TEXT NOT NULL, 
  BAIRRO TEXT,
  NUMERO INTEGER NOT NULL)`);

  db.run(`CREATE TABLE IF NOT EXISTS USUARIO (
  CPF TEXT PRIMARY KEY NOT NULL,
  NOME TEXT NOT NULL, 
  TELEFONE TEXT NOT NULL,
  EMAIL TEXT NOT NULL,
  SENHA TEXT NOT NULL,
  ENDERECO INTEGER NOT NULL`);

  db.close()

  console.log("Database setup complete!");
}

function main(){
  dbSetup();
}

main();


