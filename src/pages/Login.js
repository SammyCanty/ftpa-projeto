import React, { useEffect, useState } from "react";
import { FaMoon, FaSun } from "react-icons/fa"; // Importando ícones
import { useNavigate } from "react-router-dom"; // Importando o hook useNavigate
import "./Login.css"; // Arquivo de estilo

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [rememberMe, setRememberMe] = useState(false);
  const [errors, setErrors] = useState({});
  const [isLoaded, setIsLoaded] = useState(false);
  const [theme, setTheme] = useState("dark-mode");
  const [loading, setLoading] = useState(false); // Estado de loading
  const [loginError, setLoginError] = useState(""); // Estado para erros de login

  const navigate = useNavigate(); // Hook para redirecionamento

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

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoginError(""); // Reseta erro de login
    if (validate()) {
      setLoading(true); // Mostra estado de carregamento
      try {
        const response = await fetch("http://localhost:8080/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            email,
            senha: password, // Certifique-se de que o nome da propriedade está correto
          }),
        });

        if (response.ok) {
          const data = await response.json();
          // Sucesso no login
          alert("Login realizado com sucesso!");
          console.log("Token JWT:", data.token); // Acessa o token JWT
          // Salve o token no localStorage ou state global
          localStorage.setItem("token", data.token);

          // Redireciona para o Dashboard após o login
          navigate("/dashboard");
        } else if (response.status === 401) {
          // Erro de autenticação (credenciais inválidas)
          const errorData = await response.json();
          setLoginError(errorData.message || "Credenciais inválidas");
        } else {
          // Outros erros (erro interno, etc)
          const errorData = await response.json();
          setLoginError(errorData.message || "Erro ao realizar o login");
        }
      } catch (error) {
        // Falha na requisição (por exemplo, erro de rede)
        setLoginError("Falha ao conectar ao servidor");
      } finally {
        setLoading(false); // Finaliza estado de carregamento
      }
    }
  };

  const toggleTheme = () => {
    setTheme((prevTheme) =>
      prevTheme === "dark-mode" ? "light-mode" : "dark-mode"
    );
  };

  return (
    <>
      <button
        onClick={toggleTheme}
        className="theme-toggle"
        style={{ color: theme === "dark-mode" ? "white" : "black" }}
      >
        {theme === "dark-mode" ? <FaSun /> : <FaMoon />}
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

          {loginError && <p className="error">{loginError}</p>} {/* Exibe erro de login */}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? "Carregando..." : "Login"}
          </button>
        </form>
      </div>
    </>
  );
}

export default Login;
