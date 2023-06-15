import styles from './ItemCardapio.module.css'

function ItemCardapio(props){

    return(
      <div className={styles.container}>
        <div className={styles.innerDiv}>
          <p className={styles.description}>{props.description}</p>
          <p className={styles.price}>{props.price}</p>
        </div>
        <button className={styles.button}>+</button>
      </div>
    );
}

export default ItemCardapio;