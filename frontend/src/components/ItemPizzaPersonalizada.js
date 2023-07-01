import styles from './ItemPizzaPersonalizada.module.css'
import { useState } from 'react';
import ModalPizzaPersonalizada from './ModalPizzaPersonalizada';
import pizzaPersonalizada from '../assets/pizzas/pizzaPersonalizada.png'

function ItemPizzaPersonalizada(props){

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };


    return (
      <div className={styles.item}>
        <img className={styles.image} src={pizzaPersonalizada} onClick={openModal}/>
        <p className={styles.description}>{props.description}</p>
        <p className={styles.price}>R$ {props.price}</p>
        {isModalOpen && (
          <ModalPizzaPersonalizada
            //key={props.key}
            image={pizzaPersonalizada}
            description={`Monte sua pizza de dois sabores!`}
            price={60}
            onClose={closeModal}
          />
        )}
      </div>
    );
}

export default ItemPizzaPersonalizada;