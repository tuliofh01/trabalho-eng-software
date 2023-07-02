import styles from "./Header.module.css";
import logo from "../assets/logo.png"
import profilePic from "../assets/profilePic.png"
import { useNavigate } from "react-router-dom";

function Header() {
  
  const navigate = useNavigate();
  
  return (
    <header className={styles.container}>
      <img className={styles.logo} src={logo} />
      <div className={styles.innerDiv}>
        <p className={styles.link} onClick={() => navigate("/cardapio")}>
          Menu
        </p>
        <p className={styles.link} onClick={() => navigate("/meusPedidos")}>
          Meus pedidos</p>
        <p className={styles.link} onClick={() => navigate("/carrinho")}>
          Carrinho
        </p>
        <div className={styles.profileButton} onClick={() => navigate("/perfil")}>
          <img src={profilePic} className={styles.profilePic}></img>
          <div className={styles.profileLink}>Olá, {JSON.parse(localStorage["userData"]).NOME}</div>
        </div>
      </div>
    </header>
  );
}

export default Header;
