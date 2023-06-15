import { useNavigate } from 'react-router-dom';
import styles from './Cadastro.module.css'
import logo from '../assets/logo.png'


function Cadastro(){

    const navigate = useNavigate();

    function loginRoute(){
      navigate("/login");
    }

    function formHandler(event){
      event.preventDefault();
      
    }

    return (
      <div className={styles.container}>
        <img src={logo} className={styles.logo} />
        <form>
          <input className={styles.inputField} placeholder="Nome completo" />
          <input className={styles.inputField} placeholder="E-mail" />
          <input className={styles.inputField} placeholder="Senha" />
          <div className={styles.innerDiv}>
            <input className={styles.inputField} placeholder="Telefone" />
            <input className={styles.inputField} placeholder="CPF" />
          </div>
          <input className={styles.inputField} placeholder="Logradouro" />
          <div className={styles.innerDiv}>
            <input className={styles.inputField} placeholder="CEP" />
            <input className={styles.inputField} placeholder="Bairro" />
          </div>
          <button className={styles.submitButton}>Cadastrar</button>
        </form>
        <p className={styles.text}>Já possui uma conta? <a className={styles.link} onClick={loginRoute}>Voltar para a tela de Login</a></p>
      </div>
    );

}

export default Cadastro;