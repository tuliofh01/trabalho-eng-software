const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.resolve(__dirname, "../assets/database.db");
const db = new Database(dbPath);
const transaction = `create table BAIRRO (
	ID integer primary key autoincrement,
	NOME text
);

create table ENDERECO (
	ID integer primary key autoincrement,
	CEP text,
	IDBAIRRO integer,
	LOGRADOURO text,
	NUMERO integer,
	
	foreign key (IDBAIRRO)
	references BAIRRO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

create table USUARIO (
	CPF text primary key not null,
	NOME text,
	TELEFONE text,
	EMAIL text not null unique,
	SENHA text not null,
	IDENDERECO integer,
	
	foreign key (IDENDERECO)
	references ENDERECO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

create table PEDIDO (
	ID integer primary key autoincrement,
	CPF text,
	STATUSPEDIDO text,
	IDENDERECO integer,
	VALORTOTAL numeric default 0,
	DATAHORA date,
	
	foreign key (IDENDERECO)
	references ENDERECO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

create table SABOR_PIZZA (
	ID integer primary key autoincrement,
	DESCRICAO text
);

create table ITEMCARDAPIO (
	ID integer primary key autoincrement,
	DESCRICAO text,
	VALOR numeric default 0,
	IMAGEM_PATH text,
	TIPO text,
	IDSABOR1 integer,
	IDSABOR2 integer,
	
	foreign key (IDSABOR1)
	references SABOR_PIZZA(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
		
	foreign key (IDSABOR2)
	references SABOR_PIZZA(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

create table ITEMPEDIDO (
	IDPEDIDO integer,
	IDITEM integer,
	QUANTIDADE integer,
	
	primary key (IDPEDIDO, IDITEM),
	
	foreign key (IDPEDIDO)
	references PEDIDO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
		
	foreign key (IDITEM)
	references ITEMCARDAPIO(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)`;

db.prepare(transaction).run();