import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const Register = () => {
  const [nom, setNom] = useState('');
  const [prenom, setPrenom] = useState('');
  const [role, setRole] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [photo, setPhoto] = useState(null);
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async () => {
    try {
      // Lire la photo en base64
      let photoBase64 = '';
      if (photo) {
        const reader = new FileReader();
        reader.readAsDataURL(photo);
        reader.onloadend = async () => {
          photoBase64 = reader.result;
          await sendRegistrationRequest(photoBase64);
        };
      } else {
        await sendRegistrationRequest(photoBase64); // Appeler la fonction même si la photo est null
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setMessage('Erreur lors de l\'inscription');
    }
  };
  
  // Fonction pour envoyer les données de l'inscription
  const sendRegistrationRequest = async (photoBase64) => {
    const user = {
      nom,
      prenom,
      role,
      email,
      password,
      photo: photoBase64, // Inclure la photo en base64
    };
  
    try {
      const response = await fetch('http://localhost:8081/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(user),
      });
  
      if (response.ok) {
        localStorage.setItem('role', role);
        setMessage('Inscription réussie');
        navigate('/modifications');
      } else {
        setMessage('Erreur lors de l\'inscription');
      }
    } catch (error) {
      console.error('Erreur lors de l\'inscription:', error);
      setMessage('Erreur lors de l\'inscription');
    }
  };
  

  return (
    <div className="container">
      <div className="row justify-content-center align-items-center vh-100">
        <div className="col-md-6">
          <div className="card p-4">
            <h2 className="text-center mb-4">Inscription</h2>
            <form>
              <div className="mb-3">
                <label htmlFor="nom" className="form-label">Nom:</label>
                <input type="text" id="nom" className="form-control" value={nom} onChange={(e) => setNom(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="prenom" className="form-label">Prénom:</label>
                <input type="text" id="prenom" className="form-control" value={prenom} onChange={(e) => setPrenom(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="role" className="form-label">Rôle:</label>
                <select id="role" className="form-control" value={role} onChange={(e) => setRole(e.target.value)}>
                  <option value="">Sélectionner un rôle</option>
                  <option value="0">user</option>
                  
                </select>
              </div>
              <div className="mb-3">
                <label htmlFor="email" className="form-label">Email:</label>
                <input type="email" id="email" className="form-control" value={email} onChange={(e) => setEmail(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="password" className="form-label">Mot de passe:</label>
                <input type="password" id="password" className="form-control" value={password} onChange={(e) => setPassword(e.target.value)} />
              </div>
              <div className="mb-3">
                <label htmlFor="photo" className="form-label">Photo:</label>
                <input type="file" id="photo" className="form-control" onChange={(e) => setPhoto(e.target.files[0])} />
              </div>
              <button type="button" onClick={handleRegister} className="btn btn-primary mb-3">S'inscrire</button>
              <p className="text-center">{message}</p>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Register;
