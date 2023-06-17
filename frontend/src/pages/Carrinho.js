import { useEffect, useState } from "react";
import Header from "../components/Header";
import { useNavigate } from "react-router-dom";
import styles from "./Carrinho.module.css"


function Carrinho(){

    const [itensCarrinho, setItensCarrinho] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
      if (!localStorage.getItem("token")) {
        navigate("/");
      }

      const localStorageData = localStorage.getItem("itensPedido");
      if(localStorageData){
        setItensCarrinho(localStorageData.split(";"));
      }
    }, []);

    function shoppingCartHandler(){
      
    }

    return (
      <div className={styles.container}>
        <Header />
        <h2 className={styles.title}>Itens no carrinho</h2>
        <table className={styles.table}>
          <tbody>
            {itensCarrinho.map((item) => (
              <tr>
                <td className={styles.td}>{item}</td>
              </tr>
            ))}
          </tbody>
        </table>
        <p className={styles.p}>
          <strong>Total:</strong> R${localStorage.getItem("totalPedido")}
        </p>
      </div>
    );
}

export default Carrinho;