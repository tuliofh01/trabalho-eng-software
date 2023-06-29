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
    let idItemCarrinho;
    await axios
      .post("/getItemId", {
        descricao: props.description,
      })
      .then((response) => {
        idItemCarrinho = response.data;

        const itemsArray = localStorage.getItem("ItensPedido");
        const totalPrice = localStorage.getItem("TotalPedido");

        // Sets purchased items by ID
        if (itemsArray) {
          localStorage.setItem(
            "ItensPedido",
            itemsArray +
              ";" +
              quantidadeRef.current.value +
              "-" +
              idItemCarrinho
          );
        } else {
          localStorage.setItem(
            "ItensPedido",
            quantidadeRef.current.value + "-" + idItemCarrinho
          );
        }

        // Sets total price
        if (totalPrice) {
          localStorage.setItem(
            "TotalPedido",
            String(
              Number(totalPrice) +
                Number(props.price) * Number(quantidadeRef.current.value)
            )
          );
        } else {
          localStorage.setItem(
            "TotalPedido",
            String(Number(props.price) * Number(quantidadeRef.current.value))
          );
        }

        alert("Carrinho atualizado!");
      });
  }

  return (
    <div className={`modalCard ${isOpen ? "open" : ""}`}>
      <div className="modalContent">
        <img className="image" src={props.image} />
        <p className="modalText">
          {props.description} - {props.price}
        </p>
        <input
          ref={quantidadeRef}
          type="number"
          min="1"
          defaultValue={0}
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
