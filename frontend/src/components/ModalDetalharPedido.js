import { useEffect, useRef, useState } from "react";
import axios from 'axios';
import "./ModalPizzaComum.css";

function ModalDetalharPedido(props){
  
  const dadosPedido = props.dadosPedido;
  const dadosEndereco = props.dadosEndereco;
  const itensPedido = props.itensPedido;

  const [isOpen, setIsOpen] = useState(true);

  function closeModal(){
    setIsOpen(false);
    props.onClose();
  };

  const userData = JSON.parse(localStorage.getItem("userData"));
  //let orderDataResponse, orderItemsResponse, addressDataResponse;

  useEffect(() =>
  {      
  }, []);
/*
function getData()
  {
    
    orderDataResponse = axios.post("http://localhost:3333/getOrder", {
        id: props.id
    });

    console.log(orderDataResponse.data);
  
    setDadosPedido(orderDataResponse.data);

    addressDataResponse = axios.post("http://localhost:3333/getAddressData",
    {
        id: userData.IDENDERECO
    });

    setDadosEndereco(addressDataResponse.data);

    orderItemsResponse = axios.post("http://localhost:3333/getOrderItems", {
        id: orderDataResponse.data.ID
    });

    console.log(orderItemsResponse.data);

    if (orderItemsResponse.data.length > 0)
        setItensPedido(orderItemsResponse.data);
}*/

  return (
    <div className={`modalCard ${isOpen ? "open" : ""}`}>
      <div className="modalContentMeusPedidos">
            <div className="tableTitle">Pedido #{dadosPedido.ID}</div>
            <table className="table">
              <tbody>
                {itensPedido.map((item, index) => (
                  <tr className="tr" key={index}>
                    <td className="tdDesc">{item.QUANTIDADE} x {item.DESCRICAO}</td>
                    <td className="tdPrice"> R$ {(item.VALOR*item.QUANTIDADE).toFixed(2)}</td>
                  </tr>
                ))}
                <tr className="tr">
                    <td className="tdDesc"><strong>Total</strong></td>
                    <td className="tdPrice"><strong> R$ {dadosPedido.VALORTOTAL.toFixed(2)}</strong></td>
                </tr>
              </tbody>
            </table>

            <div className="tableTitle">Endereço de Entrega</div>
            <table className="table">
              <tbody>
                <tr className="tr">
                    <td className="tdDesc">{dadosEndereco.LOGRADOURO},{dadosEndereco.NUMERO} - {dadosEndereco.NOMEBAIRRO}, Belo Horizonte - MG, {dadosEndereco.CEP}</td>
                </tr>
              </tbody>
            </table>

            <button
                  className="submitButton"
                  onClick={() => closeModal()}
                >
                  Fechar
                </button>
      </div>
    </div>
  );
};

export default ModalDetalharPedido;
