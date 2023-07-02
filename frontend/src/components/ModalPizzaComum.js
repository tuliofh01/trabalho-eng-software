import { useRef, useState } from "react";
import axios from 'axios';
import "./ModalPizzaComum.css";

function ModalPizzaComum(props){
  
  const quantidadeRef = useRef();

  const [isOpen, setIsOpen] = useState(true);
  function closeModal(){
    setIsOpen(false);
    props.onClose();
  };

  async function shoppingCartHandler() {

    let idItemCarrinho = props.id;
    let idPedidoCarrinho;

    const userData = JSON.parse(localStorage.getItem("userData"));
    
     // Procura por pedido não concluido na tabela de pedidos para o usuário (equivalente ao carrinho)

    let response = await axios
      .post("http://localhost:3333/getCartOrder", {
        cpf: userData.CPF
      });

    console.log(response.data);

    if (response == null || response.data == null || response.data === "") {
      response = await axios
      .post("http://localhost:3333/createCartOrder", {
        cpf: userData.CPF
      });
    }
    
    idPedidoCarrinho = response.data.ID;
    
    if (idPedidoCarrinho)  {
      const response = await axios
        .post("http://localhost:3333/registerItemOrder", {
          token: localStorage.getItem("token"),
          idItem: idItemCarrinho,
          idOrderCart: idPedidoCarrinho,
          qtde: quantidadeRef.current.value
        });

        if (response.data.code === 'SQLITE_CONSTRAINT_TRIGGER')
          alert(response.data.message);
        else  
          alert("Carrinho atualizado!");

    } else {
      alert("ERRO: Não foi possível adicionar ao carrinho!");
    }    
  }

  return (
    <div className={`modalCard ${isOpen ? "open" : ""}`}>
      <div className="modalContent">
        <img className="image" src={props.image} />
        <p className="modalText">
          {props.description} - R$ {props.price}
        </p>
        <input
          ref={quantidadeRef}
          type="number"
          min="1"
          defaultValue={1}
          placeholder="Quantidade de itens"
        />
        <button className="modalClose" onClick={shoppingCartHandler}>
          Adicionar ao carrinho
        </button>
        <button className="modalClose" onClick={closeModal}>
          Fechar
        </button>
      </div>
    </div>
  );
};

export default ModalPizzaComum;
