import { useEffect } from 'react';
import ContainerCardapio from '../components/ContainerCardapio';
import ItemCardapio from '../components/ItemCardapio'
import Header from '../components/Header'
import styles from './Cardapio.module.css'
import { useNavigate } from 'react-router-dom';

import cocaLogo from '../assets/bebidas/coca.png'
import guaranaLogo from '../assets/bebidas/guarana.png'
import aguaLogo from '../assets/bebidas/agua.png'

import cheddarLogo from '../assets/pizzas/cheddar.png'
import frangoLogo from "../assets/pizzas/frango.png";
import milhoLogo from "../assets/pizzas/milho.png";
import portuguesaLogo from "../assets/pizzas/portuguesa.png";
import quatroQueijosLogo from "../assets/pizzas/quatroQueijos.png";
import tomateSecoLogo from "../assets/pizzas/tomateSeco.png";

import comboLogo from "../assets/combos/combo.png"

function Index(){
    const navigate = useNavigate();

    

    useEffect(() => {
        if (!localStorage.getItem("token")) {
          navigate("/");
        }
    }, []);
    
    return (
      <div className={styles.container}>
        <Header />
        <h1 className={styles.title}>Menu</h1>

        <h2 className={styles.subtitle}>Combos</h2>
        <ContainerCardapio>
          <ItemCardapio
            image={comboLogo}
            description="Pizza + Refri 2 Litros"
            price="R$ 55.00"
          />
        </ContainerCardapio>

        <h2 className={styles.subtitle}>Pizzas</h2>
        <ContainerCardapio>
          <ItemCardapio
            image={cheddarLogo}
            description="Pizza Cheddar"
            price="R$ 45.00"
          />
          <ItemCardapio
            image={frangoLogo}
            description="Pizza Frango"
            price="R$ 50.00"
          />
          <ItemCardapio
            image={milhoLogo}
            description="Pizza Milho"
            price="R$ 40.00"
          />
          <ItemCardapio
            image={portuguesaLogo}
            description="Pizza Portuguesa"
            price="R$ 50.00"
          />
          <ItemCardapio
            image={quatroQueijosLogo}
            description="Pizza Quatro Queijos"
            price="R$ 45.00"
          />
          <ItemCardapio
            image={tomateSecoLogo}
            description="Pizza Tomate Seco"
            price="R$ 40.00"
          />
        </ContainerCardapio>

        <h2 className={styles.subtitle}>Bebidas</h2>
        <ContainerCardapio>
          <ItemCardapio
            image={cocaLogo}
            description="Coca-Cola Lata"
            price="R$ 5.00"
          />
          <ItemCardapio
            image={guaranaLogo}
            description="Guaraná Lata"
            price="R$ 5.00"
          />
          <ItemCardapio
            image={aguaLogo}
            description="Água Mineral"
            price="R$ 4.00"
          />
        </ContainerCardapio>
      </div>
    );
}

export default Index;