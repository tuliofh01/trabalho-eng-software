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
    const authStatus = appModel.autenticarLogin(username, password);
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
  const passwordBuffer = SHA256(req.body.senha);
  const password = passwordBuffer.toString("base64");
  const data = {
    cpf: req.body.cpf,
    nome: req.body.nome,
    telefone: req.body.telefone,
    email: req.body.email,
    senha: password,
    endereco: req.body.endereco,
  };
  appModel.criarConta(data);
  res.status(200).send("OK!");
});

router.post("/createAddress", async (req, res) => {
  const data = {
    id: req.body.id,
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    cep: req.body.cep
  };
  appModel.criarEndereco(data);
  res.status(200).send("OK!");
});

router.post("/registerOrder", verifyToken, (req, res) => {


});

module.exports = router;