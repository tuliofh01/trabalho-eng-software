import { useRef, useState } from "react";
import "./ModalPizzaComum.css";

function ModalPizzaPersonalizada(props) {
  const quantidadeRef = useRef();
  const sabor1Ref = useRef();
  const sabor2Ref = useRef();

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
        <input ref={sabor1Ref} placeholder="Sabor 1" />
        <input ref={sabor2Ref} placeholder="Sabor 2" />
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

export default ModalPizzaPersonalizada;
