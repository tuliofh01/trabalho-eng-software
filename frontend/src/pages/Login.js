import styles from './Login.module.css'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';

function Login(){

    const navigate = useNavigate();
    
    function handleLogin(){

    }

    function handleCreateAccount(){
      navigate("/createAccount");
    }

    function handlePasswordRecovery(){
      navigate("/passwordRecovery")
    }
    
    return (
      <div className={styles.container}>
        <img src={logo} className={styles.logo}/>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Login"
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="Senha"
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Entrar
          </button>
        </form>
        <a className={styles.link} onClick={handlePasswordRecovery}>Esqueci minha senha</a>
        <p className={styles.text}>Não possui uma conta? <a className={styles.link} onClick={handleCreateAccount}>Clique aqui para se cadastrar!</a></p>
      </div>
    );
}

export default Login;