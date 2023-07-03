import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Carrinho.module.css";
import axios from "axios";

function Carrinho() {
  const [itensCarrinho, setItensCarrinho] = useState([]);
  const [dadosPedido, setDadosPedido] = useState([]); 
  const [dadosEndereco, setDadosEndereco] = useState([]); 


  const navigate = useNavigate();

  const userData = JSON.parse(localStorage.getItem("userData"));
  let orderDataResponse, orderItemsResponse, addressDataResponse;

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

      addressDataResponse = await axios.post("http://localhost:3333/getAddressData",
      {
          id: userData.IDENDERECO
      });

      setDadosEndereco(addressDataResponse.data);

      orderItemsResponse = await axios.post("http://localhost:3333/getOrderItems", {
            id: orderDataResponse.data.ID
        });

      console.log(orderItemsResponse.data);

      if (orderItemsResponse.data.length > 0)
      {
        setItensCarrinho(orderItemsResponse.data);

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
      <div className={styles.body}>
        <h2 className={styles.title}>Itens no carrinho</h2>
        {(dadosPedido == null || itensCarrinho.length === 0)&&(
        <div className={styles.subtitle}>Você ainda não colocou nenhum item no carrinho!</div>)}
        {(dadosPedido !== null && itensCarrinho.length !== 0)&&(
          <div className={styles.body}>
            <div className={styles.tableTitle}>Pedido #{dadosPedido.ID}</div>
            <table className={styles.table}>
              <tbody>
                {itensCarrinho.map((item, index) => (
                  <tr className={styles.tr} key={index}>
                    <td className={styles.tdDesc}>{item.QUANTIDADE} x {item.DESCRICAO}</td>
                    <td className={styles.tdPrice}> R$ {(item.VALOR*item.QUANTIDADE).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className={styles.tr}>
                    <td className={styles.tdDesc}><strong>Total</strong></td>
                    <td className={styles.tdPrice}><strong> R$ {dadosPedido.VALORTOTAL.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div className={styles.tableTitle}>Endereço de Entrega</div>
            <table className={styles.table}>
              <tbody>
                <tr className={styles.tr}>
                    <td className={styles.tdDesc}>{dadosEndereco.LOGRADOURO},{dadosEndereco.NUMERO} - {dadosEndereco.NOMEBAIRRO}, Belo Horizonte - MG, {dadosEndereco.CEP}</td>
                </tr>
              </tbody>
            </table>

            <div className={styles.buttonContainer}>
            <button
                className={styles.cancelButton}
                onClick={() => registerOrder("CANCELADO")}
              >
                Cancelar
              </button>
              <button
                className={styles.submitButton}
                onClick={() => registerOrder("CONFIRMADO")}
              >
                Confirmar
              </button>
              
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Carrinho;
