import axios from 'axios';
import { useRef, useState, useEffect } from "react";
import "./ModalPizzaComum.css";

function ModalPizzaPersonalizada(props) {

  const quantidadeRef = useRef();

  const sabor1Ref = useRef();
  const sabor2Ref = useRef();

  const [sabor1, setSabor1] = useState([]);
  const [sabor2, setSabor2] = useState([]);

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

    if (idPedidoCarrinho !== null)  {
    await axios
      .post("/getDoubleFlavorPizza", {
        descricao: props.description,
        sabor1Id: (sabor1Ref.current.selectedIndex+1),
        sabor2Id: (sabor2Ref.current.selectedIndex+1),
        price: 60
      })
      .then((response) => {
        if (response.data.code === 'SQLITE_CONSTRAINT_TRIGGER')
          alert(response.data.message);
        else
          idItemCarrinho = response.data.ID;
      });

      if (idItemCarrinho){
        const response2 = await axios
            .post("/registerItemOrder", {
              token: localStorage.getItem("token"),
              idItem: idItemCarrinho,
              idOrderCart: idPedidoCarrinho,
              qtde: quantidadeRef.current.value
        });

        console.log(response2);

        if (response2.data.code === 'SQLITE_CONSTRAINT_TRIGGER')
          alert(response2.data.message);
        else  
          alert("Carrinho atualizado!");
     }

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
        <select placeholder='Sabor 1' ref={sabor1Ref}>
        {sabor1.map((item) => (
         <option key={item.ID} value={item.DESCRICAO}>
         {item.DESCRICAO}
            </option>
          ))}
        </select>
        <select placeholder='Sabor 2' ref={sabor2Ref}>
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
}

export default ModalPizzaPersonalizada;
