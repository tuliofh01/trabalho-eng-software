import styles from "./ContainerCardapio.module.css"

function ContainerCardapio(props){
    return (
        <div className={styles['grid-container']}>
            {props.children}
        </div>
    );
}

export default ContainerCardapio;