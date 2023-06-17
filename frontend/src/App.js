import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import "./App.css";
import Carrinho from './pages/Carrinho';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Login/>} />
          <Route path="/carrinho" element={<Carrinho/>} />
          <Route path='/cardapio' element={<Index/>}/>
          <Route path="/criarConta" element={<Cadastro/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
