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

    shoppingCartHandler();
  }, []);

  async function shoppingCartHandler() {
    const itemsArrayRaw = localStorage.getItem("ItensPedido").split(";");
    const itemsArray = [...itemsArrayRaw];

    const itemPromises = itemsArray.map(async (item) => {
      const itemProps = item.split("-");
      const itemAmount = itemProps[0];
      const itemId = itemProps[1];

      const response = await axios.post("/getItemDescription", { id: itemId });
      const itemDescription = response.data;

      return itemAmount + " - " + itemDescription;
    });

    const updatedItems = await Promise.all(itemPromises);
    setItensCarrinho(updatedItems);
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
    </div>
  );
}

export default Carrinho;
