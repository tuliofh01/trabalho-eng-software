const sqlite3 = require("sqlite3");

async function autenticarLogin(user, password) {
  const db = new sqlite3.Database('../assets/database.db');

  let usersArray;

  await db.all(`SELECT * FROM USUARIOS WHERE USERNAME = '${user}' 
    AND PASSWORD = '${password}'`, (error, rows) => {
    if (error) {
      console.error(error);
    } else {
      usersArray = rows;
    }
  });

  db.close();

  if (usersArray[0].length > 0) {
    return true;
  } else {
    return false;
  }
}

async function criarConta(accountData){
  const db = new sqlite3.Database("../assets/database.db");

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

async function buscarPaciente(medico, nome) {
  let formattedNomePaciente = nome;
  formattedNomePaciente = formattedNomePaciente.trim().toLowerCase().split(" ");
  for (let i = 0; i < formattedNomePaciente.length; i++) {
    formattedNomePaciente[i] =
      formattedNomePaciente[i].charAt(0).toUpperCase() +
      formattedNomePaciente[i].slice(1);
  }
  formattedNomePaciente = formattedNomePaciente.join(" ");

  const patientsArray =
    await connection.query(`SELECT * FROM PACIENTES WHERE USER_MEDICO = '${medico}' 
    AND NOME LIKE '%${formattedNomePaciente}%'`);

  if (patientsArray[0].length > 0) {
    return patientsArray;
  } else {
    return false;
  }
}

async function buscarMedico(medico) {
  const nomeMedico = await connection.query(
    `SELECT NOME FROM USUARIOS WHERE USERNAME = '${medico}'`
  );
  return nomeMedico[0][0]["NOME"];
}

function criarPaciente(nome, endereco, telefone, medico) {
  connection.query(
    `INSERT INTO PACIENTES (USER_MEDICO, NOME, ENDERECO, TELEFONE) VALUES("${medico}", "${nome}", "${endereco}", "${telefone}")`
  );
}

async function buscarConsultas(data, medico) {
  const consultasArray = await connection.query(
    `SELECT * FROM CONSULTAS WHERE USER_MEDICO = '${medico}' AND DATA LIKE '${data}%'`
  );

  if (consultasArray[0].length > 0) {
    return consultasArray[0];
  } else {
    return false;
  }
}

function criarConsulta(medico, nomePaciente, data) {
  connection.query(
    `INSERT INTO CONSULTAS (USER_MEDICO, NOME_PACIENTE, DATA) VALUES("${medico}", "${nomePaciente}", "${data}")`
  );
}

function atualizarPaciente(idPaciente, remedios, anotacoes) {
  connection.query(
    `UPDATE PACIENTES SET REMEDIOS = "${remedios}", ANOTACOES = "${anotacoes}" WHERE ID = "${idPaciente}"`
  );
}

module.exports = {
  autenticarLogin: autenticarLogin,
  buscarPaciente: buscarPaciente,
  buscarConsultas: buscarConsultas,
  criarPaciente: criarPaciente,
  criarConsulta: criarConsulta,
  atualizarPaciente: atualizarPaciente,
  buscarMedico: buscarMedico,
};
