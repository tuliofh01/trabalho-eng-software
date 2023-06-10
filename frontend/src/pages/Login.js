import styles from './Login.module.css'
import Header from '../components/Header';

function Login(){
    
    function handleLogin(){

    }
    
    return (
      <div>
        <Header/>
        <form className={styles.loginCard} onSubmit={handleLogin}>
          <h2>Login</h2>
          <div className={styles.inputContainer}>
            <input
              type="text"
              placeholder="Login"
              className={styles.inputField}
            />
          </div>
          <div className={styles.inputContainer}>
            <input
              type="password"
              placeholder="Senha"
              className={styles.inputField}
            />
          </div>
          <button type="submit" className={styles.loginButton}>
            Login
          </button>
        </form>
      </div>
    );
}

export default Login;