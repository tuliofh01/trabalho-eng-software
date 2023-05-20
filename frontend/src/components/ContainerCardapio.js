import styles from "./ContainerCardapio.module.css"

function ContainerCardapio(props){
    return (
        <div className={styles.container}>
            {props.children}
        </div>
    );
}

export default ContainerCardapio;