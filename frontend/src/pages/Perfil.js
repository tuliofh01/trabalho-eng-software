import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import styles from './Perfil.module.css'
import Header from "../components/Header"

function Perfil() {
  const [dadosPerfil, setDadosPerfil] = useState([]);
  const [dadosEndereco, setDadosEndereco] = useState([]);
  const [dadosBairro, setDadosBairro] = useState([]);
  const [status, setStatus] = useState(false);
  const [loading, setLoading] = useState(true);
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

        const neighbourhoodResponde = await axios.post(
          "http://localhost:3333/getNeighborhoodData",
          {
            id: addressResponse.data[0].IDBAIRRO,
          }
        );

        const arrayPerfil = [];
        const arrayEndereco = [];
        const arrayBairro = [];

        arrayPerfil.push(response.data[0]);
        arrayEndereco.push(addressResponse.data[0]);
        arrayBairro.push(neighbourhoodResponde.data[0])

        console.log(response.data[0]);

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

  return (
    <div>
      {loading ? (
        <div>Loading...</div>
      ) : (
        <div className={styles.container}>
          <Header/>
          <div className={styles.dataContainer}>
            <h2>Dados Pessoais</h2>
            <p><strong>CPF: </strong>{status && dadosPerfil[0].CPF}</p>
            <p><strong>Nome: </strong>{status && dadosPerfil[0].NOME}</p>
            <p><strong>Telefone: </strong>{status && dadosPerfil[0].TELEFONE}</p>
            <p><strong>E-mail: </strong>{status && dadosPerfil[0].EMAIL}</p>
            <h2>Endereço</h2>
            <p><strong>Logradouro: </strong>{status && dadosEndereco[0].LOGRADOURO}</p>
            <p><strong>Bairro: </strong>{status && dadosBairro[0].NOME}</p>
            <p><strong>CEP: </strong>{status && dadosEndereco[0].CEP}</p>
          </div>
        </div>
      )}
    </div>
  );
}

export default Perfil;
