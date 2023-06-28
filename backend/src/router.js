const express = require('express');
const path = require('path');
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
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    cep: req.body.cep
  };
  const addressId = appModel.criarEndereco(data);
  res.status(200).send(addressId);
});

router.post("/registerOrder", verifyToken, (req, res) => {


});


router.get("/getNeighborhoods", (req, res) => {
  const bairros = appModel.getBairros();
  res.status(200).json(bairros)
});

router.post("/getProfileData", verifyToken, (req, res) => {
  const dados = appModel.getDadosPerfil(req.username);
  res.status(200).json(dados);
});

router.post("/getAddressData", (req, res) => {
  const dados = appModel.getEndereco(req.body.id);
  res.status(200).json(dados);
})

router.post("/getNeighborhoodData", (req, res) => {
  const dados = appModel.getBairro(req.body.id);
  res.status(200).json(dados);
});

router.get("/getFlavors", (req, res) =>
{
  const sabores = appModel.getSaboresPizza();
  res.status(200).json(sabores);
});

router.get("/getPizzas", (req, res) => {
  const pizzas = appModel.getPizzas();
  res.status(200).json(pizzas);
});

router.get("/getCombos", (req, res) => {
  const combos = appModel.getCombos();
  res.status(200).json(combos);
});

router.get("/getBebidas", (req, res) => {
  const bebidas = appModel.getBebidas();
  res.status(200).json(bebidas);
});

router.get('/getImages/:nome', function (req, res) {
  const index = appModel.getItemCardapioImage(req.params.nome);
  res.sendFile(path.resolve(index));
});

router.post('/getItemId', function (req, res){ 
  const productDescription = req.body.descricao;
  const productId = appModel.getItemCardapioId(productDescription)[0]["ID"];
  res.status(200).send(`${productId}`);
});

router.post('/getItemDescription', function (req, res){
  const productId = req.body.id;
  const productDescription = appModel.getItemCardapioDescription(productId)[0]["DESCRICAO"];
  res.status(200).send(productDescription);
});

router.post('/insertNewPizzaPersonalizada', function (req, res)
{
  console.log(req);
  const newPizza = appModel.insertNewPizzaPersonalizada(req.body.sabor1Id, req.body.sabor2Id, req.body.price);
  res.status(200).send(newPizza);
})

module.exports = router;