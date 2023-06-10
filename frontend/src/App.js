import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Index from './pages/Index';
import Login from './pages/Login';
import './App.css';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
