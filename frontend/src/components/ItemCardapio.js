import styles from './ItemCardapio.module.css'
import { useState } from 'react';
import ModalPizzaComum from './ModalPizzaComum';

function ItemCardapio(props){

  const [isModalOpen, setIsModalOpen] = useState(false);

  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

    return (
      <div className={styles.container}>
        <img className={styles.image} src={props.image} onClick={openModal}/>
        <p className={styles.description}>{props.description}</p>
        <p className={styles.price}>{props.price}</p>
        {isModalOpen && (
          <ModalPizzaComum
            image={props.image}
            description={props.description}
            price={props.price}
            onClose={closeModal}
          />
        )}
      </div>
    );
}

export default ItemCardapio;