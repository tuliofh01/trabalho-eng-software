create table BAIRRO (
	ID integer primary key autoincrement,
	NOME text
);

insert into BAIRRO (NOME) values ('Aeroporto'), ('Bispo de Maura'), ('Braúnas'), ('Campus UFMG'), ('Confisco'), ('Conjunto Celso Machado'), ('Conjunto Lagoa'), ('Conjunto São Francisco de Assis'), ('Engenho Nogueira'), ('Garças'), ('Indaiá'), ('Itatiaia'), ('Jaraguá'), ('Jardim Atlântico'), ('Lagoa da Pampulha'), ('Nova Pampulha'), ('Novo Ouro Preto'), ('São Francisco'), ('São José'), ('Trevo'), ('Universitário'), ('Vila Aeroporto Jaraguá'), ('Vila Antena Montanhês'), ('Vila Engenho Nogueira'), ('Vila Jardim Alvorada'), ('Vila Jardim Montanhês'), ('Vila Jardim São José'), ('Vila Paquetá'), ('Vila Real I'), ('Vila Real II'), ('Vila Rica'), ('Vila Santa Rosa'), ('Vila Santo Antônio'), ('Vila Santo Antônio Barroquinha'), ('Vila São Francisco'), ('Vila Suzana I'), ('Vila Suzana II'), ('Xangri-lá'), ('Unidas'), ('Universo');

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
	DESCRICAO text,
	IDENDERECO integer,
	VALOR numeric,
	
	foreign key (IDENDERECO)
	references ENDERECO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

create table SABOR_PIZZA (
	ID integer primary key autoincrement,
	DESCRICAO text
);

insert into SABOR_PIZZA (DESCRICAO) values ('Cheddar'), ('Frango'), ('Milho'), ('Portuguesa'), ('Quatro Queijos'), ('Tomate Seco'), ('Pepperoni'), ('Calabresa'), ('Frango com Catupiry'), ('Carne seca');

create table ITEMCARDAPIO (
	ID integer primary key autoincrement,
	DESCRICAO text,
	VALOR numeric,
	IMAGEM_PATH text,
	TIPO text,
	IDSABOR1 integer,
	IDSABOR2 integer,
	
	foreign key (IDSABOR1)
	references SABOR(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
		
	foreign key (IDSABOR2)
	references SABOR(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
);

insert into ITEMCARDAPIO (DESCRICAO, VALOR, TIPO, IDSABOR1)
values ('Pizza teste', 90.2, 'Pizza', 1);

create table ITEMPEDIDO (
	IDPEDIDO integer,
	IDITEM integer,
	QUANTIDADE integer,
	
	foreign key (IDPEDIDO)
	references PEDIDO (ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION,
		
	foreign key (IDITEM)
	references ITEM_CARDAPIO(ID)
		ON DELETE NO ACTION
		ON UPDATE NO ACTION
)

