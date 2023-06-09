import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from "./Perfil.module.css";
import Header from "../components/Header";

function Perfil() {
  const [dadosPerfil, setDadosPerfil] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState([]);
  const [dadosBairro, setDadosBairro] = useState([]);
  const [IDENDERECO, setIDENDERECO] = useState();
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
          "/getProfileData",
          {
            token: localStorage.getItem("token"),
          }
        );

        const addressResponse = await axios.post(
          "/getAddressData",
          {
            id: response.data[0].IDENDERECO,
          }
        );
        setIDENDERECO(response.data.IDENDERECO);
        console.log(IDENDERECO);

        const neighborhoodResponse = await axios.post(
          "/getNeighborhoodData",
          {
            id: addressResponse.data.IDBAIRRO,
          }
        );

        const arrayPerfil = [];
        const arrayEndereco = [];
        const arrayBairro = [];

        arrayPerfil.push(response.data[0]);
        arrayEndereco.push(addressResponse.data);
        arrayBairro.push(neighborhoodResponse.data);

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
      .get("/getNeighborhoods")
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
  const numeroRef = useRef(null);

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
      numero: numeroRef.current.value
    };

    console.log(formData)

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
          <form className={styles.dataContainer}>
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
                value={status ? dadosPerfil[0].EMAIL : ""}
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
                defaultValue={status ? dadosBairro[0].NOMEBAIRRO : ""}
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
            <div className={styles.inputGroup}>
              <label htmlFor="cep">NUMERO</label>
              <input
                type="number"
                id="numero"
                defaultValue={status ? dadosEndereco[0].NUMERO : ""}
                ref={numeroRef}
              />
            </div>
            <button type="submit" onClick={formHandler}>Confirmar dados</button>
          </form>
        </div>
      )}
    </div>
  );
}

export default Perfil;
