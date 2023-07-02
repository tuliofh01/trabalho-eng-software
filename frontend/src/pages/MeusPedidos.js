import { useEffect, useState, useRef } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./MeusPedidos.module.css";
import axios from "axios";

function MeusPedidos() {

    const [pedidosUsuario, setPedidosUsuario] = useState([]);
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
  
return (
    <div className={styles.container}>
      <Header />
      <div className = {styles.body}>
        <h2 className={styles.title}>Meus Pedidos</h2>
        {(pedidosUsuario == null || pedidosUsuario.length === 0) && 
        (<div className={styles.subtitle}>Você ainda não fez nenhum pedido!</div>)}
        {(pedidosUsuario !== null && pedidosUsuario.length !== 0) &&
        (
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
                <td className={styles.td}></td>
              </tr>
            ))}
            </tbody>
        </table>
        )}
      </div>
    </div>
  );
}

export default MeusPedidos;
