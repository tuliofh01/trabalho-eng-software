const Database = require("better-sqlite3");
const path = require("path");
const dbPath = path.resolve(__dirname, "../assets/database.db");
const db = new Database(dbPath);
const transaction = `
CREATE TRIGGER IF NOT EXISTS verifica_criacao_cadastro
BEFORE INSERT ON USUARIO
BEGIN 
	SELECT CASE
		WHEN length(new.SENHA) < 8 THEN 
			raise (ABORT, 'Senha precisa ser igual ou maior que 8 caracteres!')
		WHEN length(new.EMAIL) = 0 THEN
			raise (ABORT, 'O campo "E-mail" é obrigatório!')
		WHEN length(new.SENHA) = 0 THEN
			raise (ABORT, 'O campo "Senha" é obrigatório!')
		WHEN length(new.CPF) = 0 THEN
			raise (ABORT, 'O campo "CPF" é obrigatório!')
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
			raise (ABORT, 'Os dois sabores da pizza não podem ser iguais!')
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

CREATE TRIGGER IF NOT EXISTS valida_quantidade_itempedido_insert
BEFORE INSERT ON ITEMPEDIDO
BEGIN 
	SELECT CASE
		WHEN new.QUANTIDADE < 1 THEN 
			raise (ABORT, 'A quantidade do item não pode ser menor que 1!')
		END;
END;

CREATE TRIGGER IF NOT EXISTS valida_quantidade_itempedido_update
BEFORE UPDATE ON ITEMPEDIDO
BEGIN 
	SELECT CASE
		WHEN new.QUANTIDADE == old.QUANTIDADE THEN 
			raise (ABORT, 'A quantidade do item não pode ser menor que 1!')
		END;
END;`;

db.prepare(transaction).run();