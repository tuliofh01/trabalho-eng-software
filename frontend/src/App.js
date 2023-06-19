import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Cardapio from './pages/Cardapio'
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import Carrinho from './pages/Carrinho';
import Perfil from './pages/Perfil';
import "./App.css";

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login />} />
          <Route path="/perfil" element={<Perfil />} />
          <Route path="/carrinho" element={<Carrinho />} />
          <Route path="/cardapio" element={<Cardapio />} />
          <Route path="/criarConta" element={<Cadastro />} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
