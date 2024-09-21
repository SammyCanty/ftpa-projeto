import React, { useState, useEffect } from "react";
import { FaSun, FaMoon } from "react-icons/fa"; // Importando ícones
import "./Login.css"; // Arquivo de estilo

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState('dark-mode');

  useEffect(() => {
    setTimeout(() => {
      setIsLoaded(true);
    }, 100); // 100ms delay para o fade-in
    document.body.className = theme; // Aplica o tema ao body
  }, [theme]);

  const validate = () => {
    let formErrors = {};
    let isValid = true;

    if (!email) {
      isValid = false;
      formErrors.email = "O campo e-mail é obrigatório";
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      isValid = false;
      formErrors.email = "Formato de e-mail inválido";
    }

    if (!password) {
      isValid = false;
      formErrors.password = "O campo senha é obrigatório";
    } else if (password.length < 6) {
      isValid = false;
      formErrors.password = "A senha deve ter pelo menos 6 caracteres";
    }

    setErrors(formErrors);
    return isValid;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (validate()) {
      // Lógica de autenticação
      console.log({ email, password, rememberMe });
      alert("Login realizado com sucesso!");
    }
  };

  const toggleTheme = () => {
    setTheme(prevTheme => (prevTheme === 'dark-mode' ? 'light-mode' : 'dark-mode'));
  };

  return (
    <>
      <button onClick={toggleTheme} className="theme-toggle" style={{ color : theme == 'dark-mode' ? 'white' : 'black' }}>
        {theme === 'dark-mode' ? <FaSun /> : <FaMoon />}
      </button>
      <div className={`login-container ${isLoaded ? "loaded" : ""}`}>
        <div className="logo">
          <img src="/logo.png" alt="Força Tática Paracatu Airsoft" />
        </div>
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="email">E-mail</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={errors.email ? "error-input" : ""}
            />
            {errors.email && <p className="error">{errors.email}</p>}
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className={errors.password ? "error-input" : ""}
            />
            {errors.password && <p className="error">{errors.password}</p>}
          </div>

          <div className="form-group checkbox-group">
            <input
              type="checkbox"
              checked={rememberMe}
              onChange={() => setRememberMe(!rememberMe)}
              id="rememberMe"
            />
            <label htmlFor="rememberMe">Relembrar login e senha</label>
          </div>

          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
