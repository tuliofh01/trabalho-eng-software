import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Cadastro.module.css'
import logo from '../assets/logo.png'
import { useRef } from 'react';


function Cadastro(){

    const navigate = useNavigate();

    // Endereço
    const logradouroRef = useRef();
    const bairroRef = useRef();
    const cepRef = useRef();

    // Dados usuário
    const nomeRef = useRef();
    const emailRef = useRef();
    const senhaRef = useRef();
    const telefoneRef = useRef();
    const cpfRef = useRef();


    function loginRoute(){
      navigate("/logarUsuario");
    }

    function formHandler(event){
      event.preventDefault();
      
      const idEndereco = Math.floor(1000000 * Math.random())
      
      axios
        .post("http://localhost:3333/createAddress", {
          id: idEndereco,
          logradouro: logradouroRef.current.value,
          bairro: bairroRef.current.value,
          cep: cepRef.current.value,
        })
        .then((response) => {
          axios
            .post("http://localhost:3333/createAccount", {
              nome: nomeRef.current.value,
              email: emailRef.current.value,
              senha: senhaRef.current.value,
              telefone: telefoneRef.current.value,
              cpf: cpfRef.current.value,
              endereco: idEndereco,
            })
            .then(() => {
              alert("Conta registrada com sucesso!");
            })
            .catch((error) => {
              console.log(error);
              alert("Falha ao criar conta...");
            });
        })
        .catch((error) => {
          console.log(error);
          alert("Falha ao registrar endereço...");
        });
    }

    return (
      <div className={styles.container}>
        <img src={logo} className={styles.logo} />
        <form onSubmit={formHandler}>
          <input ref={nomeRef} className={styles.inputField} placeholder="Nome completo" />
          <input ref={emailRef} className={styles.inputField} placeholder="E-mail" />
          <input ref={senhaRef} className={styles.inputField} placeholder="Senha" />
          <div className={styles.innerDiv}>
            <input ref={telefoneRef} className={styles.inputField} placeholder="Telefone" />
            <input ref={cpfRef} className={styles.inputField} placeholder="CPF" />
          </div>
          <input ref={logradouroRef} className={styles.inputField} placeholder="Logradouro" />
          <div className={styles.innerDiv}>
            <input ref={cepRef} className={styles.inputField} placeholder="CEP" />
            <input ref={bairroRef} className={styles.inputField} placeholder="Bairro" />
          </div>
          <button className={styles.submitButton}>Cadastrar</button>
        </form>
        <p className={styles.text}>Já possui uma conta? <a className={styles.link} onClick={loginRoute}>Voltar para a tela de Login</a></p>
      </div>
    );

}

export default Cadastro;