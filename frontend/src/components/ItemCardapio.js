import styles from './ItemCardapio.module.css'

function ItemCardapio(props){

    function itemHandler(){
      // Sets total purchase price
      const price = Number(props.price.split(" ")[1])
      let userInput;
      do {
        userInput = prompt("Quantos itens você deseja? (Entre com um número)");
      } while (isNaN(userInput));
      const amount = parseFloat(userInput) * price;
      if (!isNaN(amount)){
        alert(`R$ ${amount} adicionados ao carrinho.`);
        const totalPedido = localStorage.getItem("totalPedido");
        if (totalPedido) {
          const oldPrice = totalPedido;
          const newPrice = Number(oldPrice) + Number(amount);
          localStorage.setItem("totalPedido", newPrice);
        } else {
          localStorage.setItem("totalPedido", amount);
        }

        // Sets purchase items
        const itensPedido = localStorage.getItem("itensPedido");
        if (itensPedido) {
          const oldItems = itensPedido;
          const newItems = oldItems + "," + props.description;
          localStorage.setItem("itensPedido", newItems);
        } else {
          localStorage.setItem("itensPedido", props.description + ',');
        }
      }
    }

    return (
      <div className={styles.container} onClick={itemHandler}>
        <img className={styles.image} src={props.image} />
        <p className={styles.description}>{props.description}</p>
        <p className={styles.price}>{props.price}</p>
      </div>
    );
}

export default ItemCardapio;