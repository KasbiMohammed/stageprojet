import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const response = await fetch('http://localhost:8081/api/users/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const role = await response.json(); // Recevoir le rôle en tant qu'entier

        switch (role) {
          case 1:
            localStorage.setItem('isAdmin', '1');
            setMessage('Connecté en tant qu\'administrateur');
            navigate('/Dashboard');
            break;
          case 0:
            localStorage.setItem('isUser', '0');
            setMessage('Connecté en tant que user');
            navigate('/modifications');
            break;
          default:
            setMessage('Rôle inconnu');
        }
      } else {
        setMessage('Identifiants invalides');
      }
    } catch (error) {
      console.error('Erreur lors de la connexion:', error);
      setMessage('Erreur lors de la connexion');
    }
  };

  return (
    <div className="container d-flex align-items-center justify-content-center vh-100">
      <div className="card p-5">
        <h2 className="text-center mb-5">Connexion</h2>
        <label>Email:</label>
        <input
          type="text"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="form-control mb-2"
          required
        />
        <label>Mot de passe:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="form-control mb-2"
          required
        />
        <button
          onClick={handleLogin}
          className="btn btn-primary mb-3"
        >
          Se connecter
        </button>
        <p className="text-center text-danger">{message}</p>
      </div>
    </div>
  );
};

export default Login;
