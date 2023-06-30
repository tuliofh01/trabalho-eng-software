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
      <div className={styles.item}>
        <img className={styles.image} src={`http://localhost:3333/getImages/${props.description}`} onClick={openModal}/>
        <p className={styles.description}>{props.description}</p>
        <p className={styles.price}>R$ {props.price}</p>
        {isModalOpen && (
          <ModalPizzaComum
            id={props.id}
            image={`http://localhost:3333/getImages/${props.description}`}
            description={props.description}
            price={props.price}
            onClose={closeModal}
          />
        )}
      </div>
    );
}

export default ItemCardapio;