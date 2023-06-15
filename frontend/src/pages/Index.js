import { useState, useEffect } from 'react';
import ContainerCardapio from '../components/ContainerCardapio';
import ItemCardapio from '../components/ItemCardapio'
import Header from '../components/Header'
import styles from './Index.module.css'



function Index(){
    
    const [combos, setCombos] = useState();
    const [pizzas, setPizzas] = useState();
    const [bebidas, setBebidas] = useState();

    useEffect(() => {
        
    }, []);
    
    return (
      <div className={styles.container}>
        <Header/>
        <h1 className={styles.title}>Menu</h1>
        <h2 className={styles.subtitle}>Combos</h2>
        <ContainerCardapio>

        </ContainerCardapio>
        <h2 className={styles.subtitle}>Pizzas</h2>
        <ContainerCardapio>

        </ContainerCardapio>
        <h2 className={styles.subtitle}>Bebidas</h2>
        <ContainerCardapio>

        </ContainerCardapio>
      </div>
    );
}

export default Index;