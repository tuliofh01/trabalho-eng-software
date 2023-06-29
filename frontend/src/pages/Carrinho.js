import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Carrinho.module.css";
import axios from "axios";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    shoppingCartTable();
  }, []);

  async function shoppingCartTable() {
    try{
      const itemsArrayRaw = localStorage.getItem("ItensPedido").split(";");
      const itemsArray = [...itemsArrayRaw];

      const itemPromises = itemsArray.map(async (item) => {
      const itemProps = item.split("-");
      const itemAmount = itemProps[0];
      const itemId = itemProps[1];

      const response = await axios.post("/getItemDescription", {
        id: itemId,
      });
      const itemDescription = response.data;

      return itemAmount + " - " + itemDescription;
    });
      const updatedItems = await Promise.all(itemPromises);
      setItensCarrinho(updatedItems);
    } catch (error){
      console.log(error);
    }
    
  }

  async function registerOrder(status){
    let data;
    await axios.post("/getUserData", {
      token: localStorage.getItem("token")
    }).then((response) => data = response.data[0])
    
    let idPedido;
    await axios.post("/registerOrder", {
      token: localStorage.getItem("token"),
      cpf: data.CPF,
      endereco: Number(data.IDENDERECO),
      valor: Number(localStorage.getItem("TotalPedido")),
      statusPedido: status
    }).then((response) => idPedido = response.data);

    const itemsArrayRaw = localStorage.getItem("ItensPedido").split(";");
    const itemsArray = [...itemsArrayRaw];

    for (const element of itemsArray) {
      const qtde = element.split('-')[0]
      const itemId = element.split("-")[1];
      await axios.post("/registerItemOrder", {
        token: localStorage.getItem("token"),
        idPedido: idPedido,
        idItem: itemId,
        qtde: qtde
      });
    }
    if(status === "CONFIRMADO"){
      alert("Pedido confirmado com sucesso!");
    } else {
      alert("Pedido cancelado com sucesso!");
    }

    if(localStorage.getItem("ItensPedido") && localStorage.getItem("TotalPedido")){
      localStorage.removeItem("ItensPedido");
      localStorage.removeItem("TotalPedido");
    }
    navigate("/cardapio")
  }

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.title}>Itens no carrinho</h2>
      <table className={styles.table}>
        <tbody>
          {itensCarrinho.map((item, index) => (
            <tr key={index}>
              <td className={styles.td}>{item}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <p className={styles.p}>
        <strong>Total:</strong> R${localStorage.getItem("TotalPedido")}
      </p>
      <div className={styles.buttonContainer}>
        <button
          className={styles.submitButton}
          onClick={() => registerOrder("CONFIRMADO")}
        >
          Confirmar
        </button>
        <button
          className={styles.submitButton}
          onClick={() => registerOrder("CANCELADO")}
        >
          Cancelar
        </button>
      </div>
    </div>
  );
}

export default Carrinho;
