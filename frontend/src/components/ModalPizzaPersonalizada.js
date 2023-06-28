import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import "./ModalPizzaComum.css";

function ModalPizzaPersonalizada(props) {
  const quantidadeRef = useRef();

  const [sabor1, setSabor1] = useState([]);
  const [sabor2, setSabor2] = useState([]);

  const sabor1Ref = useRef();
  const sabor2Ref = useRef();
  
  const [isOpen, setIsOpen] = useState(true);

  useEffect(() => {
    axios.get("http://localhost:3333/getFlavors").then((response) => {
      setSabor1(response.data);
      setSabor2(response.data);
    });
  }, [sabor1, sabor2])

  function closeModal() {
    setIsOpen(false);
    props.onClose();
  }

  function shoppingCartHandler() {
    alert("Carrinho atualizado!");
  }

  function changeOptionsSabor1(event) {
    console.log(event.target.value);
    //delete sabor2[event.target.value];
    //console.log(sabor2);
  }

  function changeOptionsSabor2(event) {
    delete sabor1[event.target.value];
  }


  return (
    <div className={`modalCard ${isOpen ? "open" : ""}`}>
      <div className="modalContent">
        <img className="image" src={props.image} />
        <p className="modalText">
          {props.description} - R$ {props.price}
        </p>
        <select placeholder='Sabor 1' ref={sabor1Ref} onChange={changeOptionsSabor1}>
        {sabor1.map((item) => (
         <option key={item.ID} value={item.DESCRICAO}>
         {item.DESCRICAO}
            </option>
          ))}
        </select>
        <select placeholder='Sabor 2' ref={sabor2Ref} onChange={changeOptionsSabor2}>
          {sabor2.map((item) => (
            <option key={item.ID} value={item.DESCRICAO}>
              {item.DESCRICAO}
            </option>
          ))}
        </select>
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
