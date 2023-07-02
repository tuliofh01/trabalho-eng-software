import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";
import Header from "../components/Header";

function Perfil() {
  const [dadosPerfil, setDadosPerfil] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState([]);
  const [dadosBairro, setDadosBairro] = useState([]);
  const [dadosEnderecoRaw, setDadosEnderecoRaw] = useState([]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
  const [bairros, setBairros] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (!localStorage.getItem("token")) {
      navigate("/");
    }

    (async () => {
      try {
        const response = await axios.post(
          "http://localhost:3333/getProfileData",
          {
            token: localStorage.getItem("token"),
          }
        );

        const addressResponse = await axios.post(
          "http://localhost:3333/getAddressData",
          {
            id: response.data[0].IDENDERECO,
          }
        );
        setDadosEnderecoRaw(addressResponse.data);

        const neighbourhoodResponse = await axios.post(
          "http://localhost:3333/getNeighborhoodData",
          {
            id: addressResponse.data.IDBAIRRO,
          }
        );

        const arrayPerfil = [];
        const arrayEndereco = [];
        const arrayBairro = [];

        arrayPerfil.push(response.data[0]);
        arrayEndereco.push(addressResponse.data);
        arrayBairro.push(neighbourhoodResponse.data);

        setStatus(true);
        setDadosPerfil(arrayPerfil);
        setDadosEndereco(arrayEndereco);
        setDadosBairro(arrayBairro);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    })();
  }, []);

  useEffect(() => {
    // Fetch neighborhoods data
    axios
      .get("http://localhost:3333/getNeighborhoods")
      .then((response) => {
        setBairros(response.data);
      })
      .catch((error) => {
        console.error(error);
      });
  }, []);

  const cpfRef = useRef(null);
  const nomeRef = useRef(null);
  const telefoneRef = useRef(null);
  const emailRef = useRef(null);
  const logradouroRef = useRef(null);
  const bairroRef = useRef(null);
  const cepRef = useRef(null);

  const formHandler = async (event) => {
    event.preventDefault();

    let idBairro;
    try {
      const response = await axios.post("/getNeighborhoodId", {
        nomeBairro: bairroRef.current.value,
      });
      idBairro = response.data;
    } catch (error) {
      console.error(error);
    }

    const formData = {
      cpf: cpfRef.current.value,
      nome: nomeRef.current.value,
      telefone: telefoneRef.current.value,
      email: emailRef.current.value,
      idEndereco: dadosEndereco[0].ID,
      logradouro: logradouroRef.current.value,
      idBairro: idBairro,
      cep: cepRef.current.value,
    };

    try {
      await axios.post("/setUserData", {
        data: formData,
      });

      await axios.post("/setAddressData", {
        data: formData,
      });

      alert("Dados atualizados!");
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          <Header />
          <form className={styles.dataContainer} onSubmit={formHandler}>
            <h2>Dados Pessoais</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="cpf">CPF</label>
              <input
                type="text"
                id="cpf"
                defaultValue={status ? dadosPerfil[0].CPF : ""}
                ref={cpfRef}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="nome">Nome</label>
              <input
                type="text"
                id="nome"
                defaultValue={status ? dadosPerfil[0].NOME : ""}
                ref={nomeRef}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="telefone">Telefone</label>
              <input
                type="text"
                id="telefone"
                defaultValue={status ? dadosPerfil[0].TELEFONE : ""}
                ref={telefoneRef}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="email">E-mail</label>
              <input
                type="text"
                id="email"
                defaultValue={status ? dadosPerfil[0].EMAIL : ""}
                ref={emailRef}
              />
            </div>
            <h2>Endereço</h2>
            <div className={styles.inputGroup}>
              <label htmlFor="logradouro">Logradouro</label>
              <input
                type="text"
                id="logradouro"
                defaultValue={status ? dadosEndereco[0].LOGRADOURO : ""}
                ref={logradouroRef}
              />
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="bairro">Bairro</label>
              <select
                className={styles.inputField}
                placeholder="Bairro"
                defaultValue={status ? dadosBairro[0].NOME : ""}
                ref={bairroRef}
              >
                {bairros.map((nome) => (
                  <option key={nome} value={nome}>
                    {nome}
                  </option>
                ))}
              </select>
            </div>
            <div className={styles.inputGroup}>
              <label htmlFor="cep">CEP</label>
              <input
                type="text"
                id="cep"
                defaultValue={status ? dadosEndereco[0].CEP : ""}
                ref={cepRef}
              />
            </div>
            <button type="submit">Confirmar dados</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Perfil;
