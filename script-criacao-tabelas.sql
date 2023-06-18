create table BAIRRO (
	ID integer primary key autoincrement,
	NOME text
);

insert into BAIRRO (NOME) values ('Aeroporto'), ('Bispo de Maura'), ('Bra�nas'), ('Campus UFMG'), ('Confisco'), ('Conjunto Celso Machado'), ('Conjunto Lagoa'), ('Conjunto S�o Francisco de Assis'), ('Engenho Nogueira'), ('Gar�as'), ('Indai�'), ('Itatiaia'), ('Jaragu�'), ('Jardim Atl�ntico'), ('Lagoa da Pampulha'), ('Nova Pampulha'), ('Novo Ouro Preto'), ('S�o Francisco'), ('S�o Jos�'), ('Trevo'), ('Universit�rio'), ('Vila Aeroporto Jaragu�'), ('Vila Antena Montanh�s'), ('Vila Engenho Nogueira'), ('Vila Jardim Alvorada'), ('Vila Jardim Montanh�s'), ('Vila Jardim S�o Jos�'), ('Vila Paquet�'), ('Vila Real I'), ('Vila Real II'), ('Vila Rica'), ('Vila Santa Rosa'), ('Vila Santo Ant�nio'), ('Vila Santo Ant�nio Barroquinha'), ('Vila S�o Francisco'), ('Vila Suzana I'), ('Vila Suzana II'), ('Xangri-l�'), ('Unidas'), ('Universo');

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

create table PEDIDOS (
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

create table SABOR (
	ID integer primary key autoincrement,
	DESCRICAO text
);

insert into SABOR (DESCRICAO) values ('Cheddar'), ('Frango'), ('Milho'), ('Portuguesa'), ('Quatro Queijos'), ('Tomate Seco'), ('Pepperoni'), ('Calabresa'), ('Frango com Catupiry'), ('Carne seca');

create table ITEMCARDAPIO (
	ID integer primary key autoincrement,
	DESCRICAO text,
	VALOR numeric,
	IMAGEM_PATH text,
	TIPO integer,
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

commit;

