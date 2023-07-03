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
    const authStatus = appModel.authLogin(username, password);
    
    if (authStatus === true) {
        const payload = { username: req.body.username };
        const key = process.env.SECRET_KEY_TOKEN;
        const options = {expiresIn : "1h"}
        const token = jwt.sign(payload, key, options)
        const userData = appModel.getUserData(username);
        res.status(200).send({token, userData});
    } 
    else {
      res.status(401).json({"error": "unauthorized access"});
    }
});

router.post("/criarConta", async (req, res) => {
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
  appModel.createAccount(data);
  res.status(200).send("OK!");
});

router.post("/createAddress", async (req, res) => {
  const data = {
    logradouro: req.body.logradouro,
    bairro: req.body.bairro,
    cep: req.body.cep,
    numero:req.body.numero
  };
  const addressId = appModel.criarEndereco(data);
  res.status(200).send(addressId);
});

router.post("/registerItemOrder", verifyToken, (req, res) => {
  const data = {
    idPedido: req.body.idOrderCart,
    idItem: req.body.idItem,
    qtde: req.body.qtde
  }

  const result = appModel.registerItemOrder(data.idPedido, data.idItem, data.qtde);
  res.status(200).send(result)
});

router.post("/registerOrder", verifyToken, (req, res) => {
  const data = {
    id: req.body.idPedido,
    cpf: req.body.cpf,
    endereco: req.body.endereco,
    status: req.body.statusPedido,
    dataHora: req.body.dataHora
  };
  const result = appModel.registerOrder(data);
  res.status(200).send(result);
})

router.post("/getUserData", verifyToken, (req, res) => {
  const email = req.username;
  const data = appModel.getUserData(email);
  res.status(200).json(data);
})

router.get("/getNeighborhoods", (req, res) => {
  const bairros = appModel.getBairros();
  res.status(200).json(bairros)
});

router.post("/getProfileData", verifyToken, (req, res) => {
  const dados = appModel.getDadosPerfil(req.username);
  res.status(200).json(dados);
});

router.post("/getAddressData", (req, res) => {
  const dados = appModel.getAddressData(req.body.id);
  res.status(200).json(dados);
})

router.post("/getNeighborhoodData", (req, res) => {
  const dados = appModel.getNeighborhoodData(req.body.id);
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

router.get("/getItensMaisPedidos", (req, res) => {
  const itens = appModel.getItensMaisPedidos();
  res.status(200).json(itens);
});


router.get('/getImages/:nome', function (req, res) {
  const index = appModel.getItemCardapioImage(req.params.nome);
  res.sendFile(path.resolve(index));
});

router.post('/getMenuItem', function (req, res){ 
  const menuItem = appModel.getMenuItem(req.body.id);
  res.status(200).send(menuItem);
});

router.post('/getDoubleFlavorPizza', function (req, res)
{
  const newPizza = appModel.getDoubleFlavorPizza(req.body.sabor1Id, req.body.sabor2Id, req.body.price);
  res.status(200).send(newPizza);
});

router.post('/getPedidosUsuario', function (req, res)
{
  const pedidos = appModel.getPedidosUsuario(req.body.cpf);
  res.status(200).send(pedidos);
});

router.post('/createCartOrder', function (req, res)
{
  const cartOrder = appModel.createCartOrder(req.body.cpf);
  res.status(200).send(cartOrder);
});


router.post('/getCartOrder', function (req, res)
{
  const cartOrder = appModel.getCartOrder(req.body.cpf);
  res.status(200).send(cartOrder);
});

router.post('/getOrderItems', function (req, res)
{
  const orderItems = appModel.getOrderItems(req.body.id);
  res.status(200).send(orderItems);
});


router.post("/setUserData", function(req, res) {
  appModel.setUserData(req.body.data);
  res.status(200).send("OK!");
})

router.post("/setAddressData", function (req, res) {
  appModel.setAddressData(req.body.data);
  res.status(200).send("OK!");
});

router.post("/getNeighborhoodId", function (req, res){
  appModel.getNeighborhoodId(req.body.nomeBairro)
  
})

module.exports = router;