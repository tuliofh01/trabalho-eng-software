 create table BAIRRO (
	ID integer primary key autoincrement,
	NOME text
);

insert into BAIRRO (NOME) values ('Aeroporto'), ('Bispo de Maura'), ('Braúnas'), ('Campus UFMG'), ('Confisco'), ('Conjunto Celso Machado'), ('Conjunto Lagoa'), ('Conjunto S�o Francisco de Assis'), ('Engenho Nogueira'), ('Gar�as'), ('Indai�'), ('Itatiaia'), ('Jaragu�'), ('Jardim Atl�ntico'), ('Lagoa da Pampulha'), ('Nova Pampulha'), ('Novo Ouro Preto'), ('S�o Francisco'), ('S�o Jos�'), ('Trevo'), ('Universit�rio'), ('Vila Aeroporto Jaragu�'), ('Vila Antena Montanh�s'), ('Vila Engenho Nogueira'), ('Vila Jardim Alvorada'), ('Vila Jardim Montanh�s'), ('Vila Jardim S�o Jos�'), ('Vila Paquet�'), ('Vila Real I'), ('Vila Real II'), ('Vila Rica'), ('Vila Santa Rosa'), ('Vila Santo Ant�nio'), ('Vila Santo Ant�nio Barroquinha'), ('Vila S�o Francisco'), ('Vila Suzana I'), ('Vila Suzana II'), ('Xangri-l�'), ('Unidas'), ('Universo');

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

insert into SABOR_PIZZA (DESCRICAO) values ('Cheddar'), ('Frango'), ('Milho'), ('Portuguesa'), ('Quatro Queijos'), ('Tomate Seco'), ('Pepperoni'), ('Calabresa'), ('Frango com Catupiry'), ('Carne seca');

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
)

/* DEFINE TRIGGERS */

CREATE TRIGGER IF NOT EXISTS verifica_criacao_cadastro
BEFORE INSERT ON USUARIO
BEGIN 
	SELECT CASE
		WHEN length(new.SENHA) < 8 THEN 
			raise (ABORT, 'Senha precisa ser igual ou maior que 8 caracteres!')
		WHEN length(new.EMAIL) = 0 THEN
			raise (ABORT, 'O campo "E-mail" � obrigat�rio!')
		WHEN length(new.SENHA) = 0 THEN
			raise (ABORT, 'O campo "Senha" � obrigat�rio!')
		WHEN length(new.CPF) = 0 THEN
			raise (ABORT, 'O campo "CPF" � obrigat�rio!')
	END;
END;

CREATE TRIGGER IF NOT EXISTS verifica_alteracao_cadastro
BEFORE UPDATE ON USUARIO
BEGIN 
	SELECT CASE
		WHEN length(new.SENHA) < 8 THEN 
			raise (ABORT, 'Senha precisa ser igual ou maior que 8 caracteres!')
		END;
END;

CREATE TRIGGER IF NOT EXISTS verifica_pizza_doissabores
BEFORE INSERT ON ITEMCARDAPIO
BEGIN 
	SELECT CASE
		WHEN new.IDSABOR1 = new.IDSABOR2 THEN 
			raise (ABORT, 'Os dois sabores da pizza n�o podem ser iguais!')
		END;
END;

CREATE TRIGGER IF NOT EXISTS update_valor_total_pedido_oninsert
AFTER INSERT ON ITEMPEDIDO
BEGIN 
	UPDATE PEDIDO
	SET VALORTOTAL = (VALORTOTAL + 
					 ((SELECT VALOR FROM ITEMCARDAPIO IC WHERE IC.ID = new.IDITEM) * new.QUANTIDADE))
	WHERE new.IDPEDIDO = PEDIDO.ID;
END;

CREATE TRIGGER IF NOT EXISTS update_valor_total_pedido_onupdate
AFTER UPDATE ON ITEMPEDIDO
BEGIN 
	UPDATE PEDIDO
	SET VALORTOTAL = (VALORTOTAL
					  - ((SELECT VALOR FROM ITEMCARDAPIO IC WHERE IC.ID = new.IDITEM) * old.QUANTIDADE)
					  + ((SELECT VALOR FROM ITEMCARDAPIO IC WHERE IC.ID = new.IDITEM) * new.QUANTIDADE))
	WHERE new.IDPEDIDO = PEDIDO.ID;
END;

CREATE TRIGGER IF NOT EXISTS valida_quantidade_itempedido
BEFORE INSERT ON ITEMPEDIDO
BEGIN 
	SELECT CASE
		WHEN new.QUANTIDADE < 1 THEN 
			raise (ABORT, 'A quantidade do item n�o pode ser menor que 1!')
		END;
END;





