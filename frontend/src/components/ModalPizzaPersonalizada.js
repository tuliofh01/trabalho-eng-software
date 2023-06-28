import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import "./ModalPizzaComum.css";

function ModalPizzaPersonalizada(props) {
  const quantidadeRef = useRef();

  const sabor1Ref = useRef();
  const sabor2Ref = useRef();


  const [sabor1, setSabor1] = useState([]);
  const [sabor2, setSabor2] = useState([]);

  let selectedSabor1;
  let selectedSabor2;
  
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

  async function shoppingCartHandler() {
    let idItemCarrinho;


    await axios
      .post("/insertNewPizzaPersonalizada", {
        descricao: props.description,
        sabor1Id: (sabor1Ref.current.selectedIndex+1),
        sabor2Id: (sabor2Ref.current.selectedIndex+1),
        valor: props.price
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

  function changeOptionsSabor1(e) {
    console.log(e.target.value);
    console.log(e.target.selectedIndex);
    console.log(sabor1Ref.current);
    //selectedSabor1 = e.target.value;
    //delete sabor2[event.target.value];
    //console.log(sabor2);
  }

  function changeOptionsSabor2(event) {
    //delete sabor1[event.target.value];
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
          min="1"
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
