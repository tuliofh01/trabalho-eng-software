import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import styles from './Cadastro.module.css'
import logo from '../assets/logo.png'
import { useEffect, useRef, useState } from 'react';


function Cadastro(){

    const navigate = useNavigate();

    // Dados registrados
    const [ bairros, setBairros ] = useState([]);

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

    useEffect(() => {
      axios.get("http://localhost:3333/getNeighborhoods").then((response) => {
        setBairros(response.data);
      });
    }, [])


    function loginRoute(){
      navigate("/");
    }

    async function formHandler(event){
      event.preventDefault();

      //TODO: usar async/await para evitar problema de sincronismo
      await axios
        .post("http://localhost:3333/createAddress", {
          logradouro: logradouroRef.current.value,
          bairro: bairroRef.current.value,
          cep: cepRef.current.value,
        })
        .then(async (response) => {
          await axios
            .post("http://localhost:3333/createAccount", {
              nome: nomeRef.current.value,
              email: emailRef.current.value,
              senha: senhaRef.current.value,
              telefone: telefoneRef.current.value,
              cpf: cpfRef.current.value,
              endereco: response.data,
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
          <input
            ref={nomeRef}
            className={styles.inputField}
            placeholder="Nome completo"
          />
          <input
            ref={emailRef}
            className={styles.inputField}
            placeholder="E-mail"
          />
          <input
            ref={senhaRef}
            className={styles.inputField}
            placeholder="Senha"
          />
          <div className={styles.innerDiv}>
            <input
              ref={telefoneRef}
              className={styles.inputField}
              placeholder="Telefone"
            />
            <input
              ref={cpfRef}
              className={styles.inputField}
              placeholder="CPF"
            />
          </div>
          <input
            ref={logradouroRef}
            className={styles.inputField}
            placeholder="Logradouro"
          />
          <div className={styles.innerDiv}>
            <input
              ref={cepRef}
              className={styles.inputField}
              placeholder="CEP"
            />
            <select className={styles.inputField} placeholder='Bairro' ref={bairroRef}>
              {bairros.map((nome) => (
                <option key={nome} value={nome}>
                  {nome}
                </option>
              ))}
            </select>
          </div>
          <button className={styles.submitButton}>Cadastrar</button>
        </form>
        <p className={styles.text}>
          Já possui uma conta?{" "}
          <a className={styles.link} onClick={loginRoute}>
            Voltar para a tela de Login
          </a>
        </p>
      </div>
    );

}

export default Cadastro;