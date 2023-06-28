import axios from 'axios';
import { useEffect, useState} from 'react';
import { useNavigate } from 'react-router-dom';
import ContainerCardapio from '../components/ContainerCardapio';
import Header from '../components/Header';
import ItemCardapio from '../components/ItemCardapio';
import styles from './Cardapio.module.css';

function Index(){

    const [itensPizza, setItensPizza] = useState([]);
    const [itensBebida, setItensBebida] = useState([]);
    const [itensCombo, setItensCombo] = useState([]);
    
    const navigate = useNavigate();

    useEffect(() => {
        if (!localStorage.getItem("token")) {
          navigate("/");
        }

        axios.get("http://localhost:3333/getCombos").then((response) =>
        {
          setItensCombo(response.data);
        });

        axios.get("http://localhost:3333/getPizzas").then((response) =>
        {
          setItensPizza(response.data);
        });

        axios.get("http://localhost:3333/getBebidas").then((response) =>
        {
          setItensBebida(response.data);
        });        
        
    }, []);
    
    return (
      <div className={styles.container}>
        <Header />
        <h1 className={styles.title}>Menu</h1>

        <h2 className={styles.subtitle}>Combos</h2>
        <ContainerCardapio>
          {itensCombo.map((item) => (
            <ItemCardapio
            key={item.ID}
            image={item.IMAGEM_PATH}
            description={item.DESCRICAO}
            price={item.VALOR}
            />
          ))}
        </ContainerCardapio>

        <h2 className={styles.subtitle}>Pizzas</h2>
        <ContainerCardapio>
          {itensPizza.map((item) => (
            <ItemCardapio
            key={item.ID}
            image={item.IMAGEM_PATH}
            description={item.DESCRICAO}
            price={item.VALOR}
            />
          ))}
        </ContainerCardapio>

        <h2 className={styles.subtitle}>Bebidas</h2>
        <ContainerCardapio>
          {itensBebida.map((item) => (
            <ItemCardapio
            key={item.ID}
            image={item.IMAGEM_PATH}
            description={item.DESCRICAO}
            price={item.VALOR}
            />
          ))}

          
        </ContainerCardapio>
      </div>
    );
}

export default Index;