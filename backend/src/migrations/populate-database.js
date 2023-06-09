const Database = require("better-sqlite3");
const path = require("path");

//Funcao para transformar variaveis em camel case
//Fonte: https://stackoverflow.com/questions/2970525/converting-any-string-into-camel-case
function camelize(str) {
    return str.replace(/(?:^\w|[A-Z]|\b\w|\s+)/g, function(match, index) {
      if (+match === 0) return ""; // or if (/\s+/.test(match)) for white spaces
      return index === 0 ? match.toLowerCase() : match.toUpperCase();
    });
  }

function populateDatabase()
{
  const dbPath = path.resolve(__dirname, "../assets/database.db");
  const db = new Database(dbPath);

  db.prepare(`insert into BAIRRO (NOME) values ('Aeroporto'), ('Bispo de Maura'), ('Braúnas'), ('Campus UFMG'), ('Confisco'), ('Conjunto Celso Machado'), ('Conjunto Lagoa'), ('Conjunto São Francisco de Assis'), ('Engenho Nogueira'), ('Garoas'), ('Indaiá'), ('Itatiaia'), ('Jaraguá'), ('Jardim Atlântico'), ('Lagoa da Pampulha'), ('Nova Pampulha'), ('Novo Ouro Preto'), ('São Francisco'), ('São José'), ('Trevo'), ('Universitário'), ('Vila Aeroporto Jaraguá'), ('Vila Antena Montanhês'), ('Vila Engenho Nogueira'), ('Vila Jardim Alvorada'), ('Vila Jardim Montanhês'), ('Vila Jardim São José'), ('Vila Paquetá'), ('Vila Real I'), ('Vila Real II'), ('Vila Rica'), ('Vila Santa Rosa'), ('Vila Santo Antônio'), ('Vila Santo Antônio Barroquinha'), ('Vila São Francisco'), ('Vila Suzana I'), ('Vila Suzana II'), ('Xangri-lá'), ('Unidas'), ('Universo')`).run();

  db.prepare(`insert into SABOR_PIZZA (DESCRICAO) values ('Cheddar'), ('Frango'), ('Milho'), ('Portuguesa'), ('Quatro Queijos'), ('Tomate Seco'), ('Pepperoni'), ('Calabresa'), ('Frango com Catupiry'), ('Carne seca')`).run();

  const querySabores = `SELECT * FROM SABOR_PIZZA`;
  const rowsSabores = db.prepare(querySabores).all();
  let counter = 1;
                
  for (let row in rowsSabores)
  {
    const queryPizzas = `insert into ITEMCARDAPIO (ID, DESCRICAO, VALOR, TIPO, IMAGEM_PATH, IDSABOR1)
    values (?, ?, ?, ?, ?, ?)`;

    //random number between 20 and 100
    const valor = (Math.random() * (100 - 20) + 20).toFixed(2);
    const values = [counter, (`Pizza de `+rowsSabores[row].DESCRICAO), valor, 'Pizza', `../frontend/src/assets/pizzas/${camelize(rowsSabores[row].DESCRICAO)}.png`, rowsSabores[row].ID];

    db.prepare(queryPizzas).run(values);

    const resultQuery = `SELECT * FROM ITEMCARDAPIO WHERE ID = ${counter}`;
    console.log(`New ITEMCARDAPIO inserted: `+db.prepare(resultQuery).all());
    counter++;
  }

  const queryBebidas = `insert into ITEMCARDAPIO (ID, DESCRICAO, VALOR, TIPO, IMAGEM_PATH)
  values (11,'Coca-cola', 10, 'Bebida', '../frontend/src/assets/bebidas/coca.png'), 
         (12,'Guaraná', 8, 'Bebida', '../frontend/src/assets/bebidas/guarana.png'), 
         (13,'Água mineral', 5, 'Bebida', '../frontend/src/assets/bebidas/agua.png')`;

  db.prepare(queryBebidas).run();

  const queryCombos = `insert into ITEMCARDAPIO (ID, DESCRICAO, VALOR, TIPO, IMAGEM_PATH)
  values (14, 'Combo 1 - 1 Pizza Portuguesa + 1 Coca-cola', 60.00, 'Combo', '../frontend/src/assets/combos/combo1.png'),
         (15, 'Combo 2 - 1 Pizza Portuguesa + 2 Coca-colas', 75.00, 'Combo', '../frontend/src/assets/combos/combo2.png'),
         (16, 'Combo 3 - 2 Pizzas Quatro Queijos e Calabresa + 1 Coca-cola', 120.00, 'Combo', '../frontend/src/assets/combos/combo3.png'),
         (17, 'Combo 4 - 1 Pizza Tomate Seco + 1 Guaraná', 70, 'Combo', '../frontend/src/assets/combos/combo4.png'),
         (18, 'Combo 5 - 2 Pizzas Frango e Pepperoni + 1 Guaraná', 130, 'Combo', '../frontend/src/assets/combos/combo5.png')`;

  db.prepare(queryCombos).run();

  db.prepare(`UPDATE SQLITE_SEQUENCE SET seq = 18 WHERE name = 'ITEMCARDAPIO'`).run();
}

populateDatabase();