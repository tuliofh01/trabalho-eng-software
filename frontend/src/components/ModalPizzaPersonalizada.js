import { useRef, useState } from "react";
import "./ModalPizzaComum.css";

function ModalPizzaPersonalizada(props) {
  const quantidadeRef = useRef();

  const [isOpen, setIsOpen] = useState(true);
  function closeModal() {
    setIsOpen(false);
    props.onClose();
  }

  function shoppingCartHandler() {
    alert("Carrinho atualizado!");
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
          min="0"
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
}

export default ModalPizzaComum;
