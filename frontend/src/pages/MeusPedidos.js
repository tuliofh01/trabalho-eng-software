import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./MeusPedidos.module.css";
import axios from "axios";
import ModalDetalharPedido from "../components/ModalDetalharPedido"

function MeusPedidos() {

    const [pedidosUsuario, setPedidosUsuario] = useState([]);

    const [pedidoDetalhado, setPedidoDetalhado] = useState([]);
    const pedidosDetalhadosRef = useRef();

    const [itensPedido, setItensPedido] = useState([]); 
    const [dadosPedido, setDadosPedido] = useState([]); 
    const [dadosEndereco, setDadosEndereco] = useState([]); 

    const [isModalOpen, setIsModalOpen] = useState(false);

    const openModal = () => {
      setIsModalOpen(true);
    };
  
    const closeModal = () => {
      setIsModalOpen(false);
      setPedidoDetalhado(0);
    };
  

    const navigate = useNavigate();
    const userData = JSON.parse(localStorage.getItem("userData"));

    useEffect(() => {
      if (!localStorage.getItem("token")) {
        navigate("/");
      }

      axios.post("http://localhost:3333/getPedidosUsuario", {
        cpf: userData.CPF
      })
      .then((response) =>
        {
          setPedidosUsuario(response.data.reverse());
        });

    });

  async function detalharPedido(idPedido){   
    let orderDataResponse, orderItemsResponse, addressDataResponse;

    setPedidoDetalhado(idPedido);

    orderDataResponse = await axios.post("http://localhost:3333/getOrder", {
        id: idPedido
    });

    console.log(orderDataResponse.data);
  
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
        setItensPedido(orderItemsResponse.data);

    openModal();
  }
  
  
  function apagarPedido(idPedido){
    const response = axios.post("http://localhost:3333/deleteOrder", {
      id: idPedido
    });
  } 
  
return (
    <div className={styles.container}>
      <Header />
      <div className = {styles.body}>
        <h2 className={styles.title}>Meus Pedidos</h2>
        {(pedidosUsuario == null || pedidosUsuario.length === 0) && 
        (<div className={styles.subtitle}>Você ainda não fez nenhum pedido!</div>)}
        {(pedidosUsuario && pedidosUsuario.length !== 0) &&
        (
        <div>
        <table className={styles.table}>
          <thead>
          <tr>
              <td className={styles.tdhead}>Nº do Pedido</td>
              <td className={styles.tdhead}>Data e hora</td>
              <td className={styles.tdhead}>Valor total</td>
              <td className={styles.tdhead}>Status</td>
              <td className={styles.tdhead}></td>
          </tr>
          </thead>
          <tbody>
            {pedidosUsuario.map((item, index) => (
              <tr key={index}>
                <td className={styles.td}>Pedido #{item.ID}</td>
                <td className={styles.td}>{item.DATAHORA}</td>
                <td className={styles.td}>R$ {item.VALORTOTAL.toFixed(2).replace('.', ',')}</td>
                <td className={styles.td}>{item.STATUSPEDIDO}</td>
                <td className={styles.td}> 
                <button
                  className={styles.submitButton}
                  onClick={() => detalharPedido(item.ID)}
                >
                  Detalhar
                </button>
                <button
                  className={styles.submitButton}
                  onClick={() => apagarPedido(item.ID)}
                >
                  Deletar
                </button>
                </td>
              </tr>
            ))}
            </tbody>
        </table>
        </div>
        )}
        {isModalOpen && (
          <ModalDetalharPedido
            dadosPedido={dadosPedido}
            dadosEndereco={dadosEndereco}
            itensPedido={itensPedido}
            onClose={closeModal}
          />
        )}
      </div>
    </div>
  );
}

export default MeusPedidos;
