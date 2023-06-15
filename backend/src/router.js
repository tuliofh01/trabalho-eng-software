const express = require('express');
const { SHA256 } = require("sha2");
const appModel = require('./models/appModel')
const jwt = require("jsonwebtoken")
require('dotenv').config()


const router = express.Router();

function verifyToken(req, res, next){
    const token = req.body.token;
    jwt.verify(token, process.env.SECRET_KEY_TOKEN, (err, decoded) => {
      if (err) {
        return res.status(401).end();
      } else {
        req.username = decoded.username;
        console.log(`${decoded.username} made a request.`);
        next();
      }
    });
}

router.post("/authenticateUser", async (req, res) => {  
    const username = req.body.username;
    
    const passwordBuffer = SHA256(req.body.password)
    const password = passwordBuffer.toString("base64")

    const authStatus = await appModel.autenticarLogin(username, password);

    if (authStatus === true) {
        const payload = { username: req.body.username };
        const key = process.env.SECRET_KEY_TOKEN;
        const options = {expiresIn : "1h"}
        const token = jwt.sign(payload, key, options)
        res.status(200).send(token);
    } 
    else {
      res.status(401).json({"error": "unauthorized access"});
    }

});

router.post("/createAccount", async (req, res) => {
  const passwordBuffer = SHA256(req.body.password);
  const password = passwordBuffer.toString("base64");

  const data = {
    cpf: accountData.cpf,
    nome: accountData.nome, 
    telefone: accountData.telefone,
    email: accountData.email, 
    senha: password, 
    endereco: accountData.endereco
  }

  const authStatus = await appModel.criarConta(data);

  if (authStatus === true) {
    const payload = { username: data.email };
    const key = process.env.SECRET_KEY_TOKEN;
    const options = { expiresIn: "1h" };
    const token = jwt.sign(payload, key, options);
    res.status(200).send(token);
  } else {
    res.status(401).json({ error: "unable to create account" });
  }
});

router.post("/buscarMedico", verifyToken, async (req, res) => {
  const nomeMedico = await appModel.buscarMedico(req.username);
  res.status(200).send(nomeMedico);
})

router.post("/buscarPaciente", verifyToken, async (req, res) => {
  const patientsList = await appModel.buscarPaciente(req.username, req.body.nome);

    if (patientsList === false){
        res.status(404).json({"error": "no patients found"});
    } else{
        res.status(200).json(patientsList);
    }
});

router.post("/buscarConsultas", verifyToken, async (req, res) => {
    const consultasList = await appModel.buscarConsultas(req.body.data, req.username);
    if (consultasList === false) {
      res.status(404).json({ error: "no consultas found" });
    } else{
      res.status(200).json(consultasList);
    }
    
});

router.post("/criarPaciente", verifyToken, async (req, res) => {
    appModel.criarPaciente(req.body.nome, req.body.endereco, req.body.telefone, req.username);
    res.status(200).send("ok");
});

router.post("/criarConsulta", verifyToken, async (req, res) => {
    appModel.criarConsulta(req.username, req.body.nomePaciente, req.body.data);
    res.status(200).send("ok");
});

router.post("/atualizarPaciente", verifyToken, (req, res) => {
    appModel.atualizarPaciente(req.body.idPaciente, req.body.remedios, req.body.anotacoes);
    res.status(200).send("ok");
});

module.exports = router;