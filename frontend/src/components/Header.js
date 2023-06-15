import styles from "./Header.module.css";
import logo from "../assets/logo.png"
import profilePic from "../assets/profilePic.png"

function Header() {
  return (
    <header className={styles.container}>
      <img className={styles.logo} src={logo}/>
      <div className={styles.innerDiv}>
        <p className={styles.link}>Menu</p>
        <p className={styles.link}>Meus pedidos</p>
        <p className={styles.link}>Carrinho</p>
        <img className={styles.profilePic} src={profilePic}/>
      </div>
    </header>
  );
}

export default Header;
