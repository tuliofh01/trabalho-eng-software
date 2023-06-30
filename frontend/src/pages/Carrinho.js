import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Carrinho.module.css";
import axios from "axios";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [dadosPedido, setDadosPedido] = useState([]); 

  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  let orderDataResponse, orderItemsResponse;

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    shoppingCartTable();
    
  }, []);

 async function shoppingCartTable() {
      orderDataResponse = await axios.post("http://localhost:3333/getCartOrder", {
            cpf: userData.CPF
        });
      
      setDadosPedido(orderDataResponse.data);

      orderItemsResponse = await axios.post("http://localhost:3333/getOrderItems", {
            id: orderDataResponse.data.ID
        });

      if (orderItemsResponse.data.length > 0)
      {
        let items = new Array(0);

        for (let itemPedido in orderItemsResponse.data) {
          const itemResponse = await axios.post("http://localhost:3333/getMenuItem",
          {
            id: orderItemsResponse.data[itemPedido].IDITEM
          })

          const item = itemResponse.data;
          item.QUANTIDADE = orderItemsResponse.data[itemPedido].QUANTIDADE;

          items.push(itemResponse.data);
        }

        setItensCarrinho(items);

        return (orderDataResponse.data);
      }    
  }

  async function registerOrder(status){    

    const dataHoraAtuais = new Date();

    await axios.post("/registerOrder", {
      idPedido: dadosPedido.ID,
      token: localStorage.getItem("token"),
      cpf: userData.CPF,
      endereco: Number(userData.IDENDERECO),
      statusPedido: status,
      dataHora: dataHoraAtuais.toLocaleString('pt-BR', {timezone: 'UTC-3'})

    });

      if(status === "CONFIRMADO"){
        alert("Pedido confirmado com sucesso!");
      } else {
        alert("Pedido cancelado com sucesso!");
      }

      navigate("/cardapio");
  }

  return (
    <div className={styles.container}>
      <Header />
      <h2 className={styles.title}>Itens no carrinho</h2>
      {(dadosPedido == null || itensCarrinho.length === 0)&&(
      <div className={styles.subtitle}>Você ainda não colocou nenhum item no carrinho!</div>)}
      {(dadosPedido !== null && itensCarrinho.length !== 0)&&(
        <div className={styles.body}>
          <table className={styles.table}>
            <tbody>
              {itensCarrinho.map((item, index) => (
                <tr key={index}>
                  <td className={styles.td}>{item.QUANTIDADE}</td>
                  <td className={styles.td}>{item.DESCRICAO}</td>
                  <td className={styles.td}>{item.VALOR}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <p className={styles.p}>
            <strong>Total:</strong> R$ {dadosPedido.VALORTOTAL}
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
      )}
    </div>
  );
}

export default Carrinho;
