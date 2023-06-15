import styles from './Login.module.css'
import logo from '../assets/logo.png'
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { useRef } from 'react';

function Login(){

    const navigate = useNavigate();
    
    const usernameRef = useRef();
    const passwordRef = useRef();
    
    function handleLogin(event){
      event.preventDefault();
      
      const username = usernameRef.current.value;
      const password = passwordRef.current.value;
      
      axios
        .post("/authenticateUser", {
          username: username,
          password: password,
        })
        .then((response) => {
          localStorage.setItem("token", response.data);
          navigate("/");
        })
        .catch((error) => {
          console.log(error);
          alert("Usuário ou senha inválidos!");
        });

    }

    function handleCreateAccount(){
      navigate("/criarConta");
    }

    function handlePasswordRecovery(){
      navigate("/recuperarSenha")
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
              ref={usernameRef}
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="Senha"
              className={styles.inputField}
              ref={passwordRef}
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