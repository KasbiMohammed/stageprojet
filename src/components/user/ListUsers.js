import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form } from 'react-bootstrap';
import axios from 'axios';
import Header from '../../layout/admin/Header';
import SideNave from '../../layout/admin/SideNave';

const Users = () => {
  const isAdmin = localStorage.getItem('isAdmin') === '1';

  const [users, setUsers] = useState([]);
  const [showAddUser, setShowAddUser] = useState(false);
  const [showEditUser, setShowEditUser] = useState(false);
  const [showDeleteUser, setShowDeleteUser] = useState(false);
  const [selectedUser, setSelectedUser] = useState({});
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    password: '',
    role: '',
    photo: null
  });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Erreur lors de la récupération des utilisateurs', error);
    }
  };

  const handleFileChange = (event) => {
    setNewUser({ ...newUser, photo: event.target.files[0] });
  };

  const handleAddUser = async () => {
    let photoBase64 = '';
    if (newUser.photo) {
      const reader = new FileReader();
      reader.readAsDataURL(newUser.photo);
      reader.onloadend = async () => {
        photoBase64 = reader.result.split(',')[1];
        await sendUser(photoBase64);
      };
    } else {
      await sendUser(photoBase64);
    }
  };

  const sendUser = async (photoBase64) => {
    try {
      const user = {
        nom: newUser.nom,
        prenom: newUser.prenom,
        email: newUser.email,
        password: newUser.password,
        role: newUser.role,
        photo: photoBase64
      };

      const response = await axios.post('http://localhost:8081/api/users', user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.status === 200) {
        fetchUsers();
        setNewUser({
          nom: '',
          prenom: '',
          email: '',
          password: '',
          role: '',
          photo: null
        });
        setShowAddUser(false);
      } else {
        console.error('Erreur lors de l\'ajout d\'un utilisateur');
      }
    } catch (error) {
      console.error('Erreur lors de l\'ajout d\'un utilisateur', error);
    }
  };

  const handleUpdateUser = async () => {
    let photoBase64 = '';

    const convertPhotoToBase64 = (file) => {
      return new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file);
        reader.onloadend = () => {
          resolve(reader.result.split(',')[1]);
        };
      });
    };

    if (newUser.photo) {
      photoBase64 = await convertPhotoToBase64(newUser.photo);
    }

    const user = {
      nom: newUser.nom,
      prenom: newUser.prenom,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      photo: photoBase64,
    };

    try {
      await axios.put(`http://localhost:8081/api/users/${selectedUser.id}`, user, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      fetchUsers();
      setShowEditUser(false);
    } catch (error) {
      console.error('Erreur lors de la mise à jour de l\'utilisateur', error);
    }
  };

  const handleDeleteUser = async () => {
    try {
      await axios.delete(`http://localhost:8081/api/users/${selectedUser.id}`);
      fetchUsers();
      setShowDeleteUser(false);
    } catch (error) {
      console.error('Erreur lors de la suppression de l\'utilisateur', error);
    }
  };

  return (
    <div>
      <Header />
      <SideNave />
      <div>
        <div className="content-wrapper">
          <section className="content">
            <h2>Liste des Utilisateurs</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Nom</th>
                  <th>Prénom</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Photo</th>
                  {isAdmin && <th>Actions</th>}
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user.id}>
                    <td>{user.id}</td>
                    <td>{user.nom}</td>
                    <td>{user.prenom}</td>
                    <td>{user.email}</td>
                    <td>{user.role}</td>
                    <td>
                      {user.photo && (
                        <img src={`data:image/jpeg;base64,${user.photo}`} alt={user.nom} style={{ width: '50px', height: '50px' }} />
                      )}
                    </td>
                    {isAdmin && (
                      <td>
                        <Button
                          variant="info"
                          onClick={() => {
                            setSelectedUser(user);
                            setNewUser({
                              nom: user.nom,
                              prenom: user.prenom,
                              email: user.email,
                              password: '',
                              role: user.role,
                              photo: null
                            });
                            setShowEditUser(true);
                          }}
                        >
                          Modifier
                        </Button>{' '}
                        <Button
                          variant="danger"
                          onClick={() => {
                            setSelectedUser(user);
                            setShowDeleteUser(true);
                          }}
                        >
                          Supprimer
                        </Button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </Table>
            {isAdmin && (
              <Button variant="primary" onClick={() => setShowAddUser(true)}>
                Ajouter un Utilisateur
              </Button>
            )}

            {/* Add User Modal */}
            <Modal show={showAddUser} onHide={() => setShowAddUser(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Ajouter un Utilisateur</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formNom">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le nom"
                      value={newUser.nom}
                      onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPrenom">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le prénom"
                      value={newUser.prenom}
                      onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrez l'email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Entrez le mot de passe"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="">Sélectionner le rôle</option>
                      <option value="1">Admin</option>
                      <option value="0">User</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formPhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowAddUser(false)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleAddUser}>
                  Ajouter
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Edit User Modal */}
            <Modal show={showEditUser} onHide={() => setShowEditUser(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Modifier un Utilisateur</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <Form>
                  <Form.Group controlId="formNom">
                    <Form.Label>Nom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le nom"
                      value={newUser.nom}
                      onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPrenom">
                    <Form.Label>Prénom</Form.Label>
                    <Form.Control
                      type="text"
                      placeholder="Entrez le prénom"
                      value={newUser.prenom}
                      onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formEmail">
                    <Form.Label>Email</Form.Label>
                    <Form.Control
                      type="email"
                      placeholder="Entrez l'email"
                      value={newUser.email}
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formPassword">
                    <Form.Label>Password</Form.Label>
                    <Form.Control
                      type="password"
                      placeholder="Entrez le mot de passe"
                      value={newUser.password}
                      onChange={(e) => setNewUser({ ...newUser, password: e.target.value })}
                    />
                  </Form.Group>
                  <Form.Group controlId="formRole">
                    <Form.Label>Role</Form.Label>
                    <Form.Control
                      as="select"
                      value={newUser.role}
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                    >
                      <option value="">Sélectionner le rôle</option>
                      <option value="1">Admin</option>
                      <option value="0">User</option>
                    </Form.Control>
                  </Form.Group>
                  <Form.Group controlId="formPhoto">
                    <Form.Label>Photo</Form.Label>
                    <Form.Control
                      type="file"
                      onChange={handleFileChange}
                    />
                  </Form.Group>
                </Form>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowEditUser(false)}>
                  Annuler
                </Button>
                <Button variant="primary" onClick={handleUpdateUser}>
                  Enregistrer les modifications
                </Button>
              </Modal.Footer>
            </Modal>

            {/* Delete User Modal */}
            <Modal show={showDeleteUser} onHide={() => setShowDeleteUser(false)} centered>
              <Modal.Header closeButton>
                <Modal.Title>Supprimer un Utilisateur</Modal.Title>
              </Modal.Header>
              <Modal.Body>
                <p>Êtes-vous sûr de vouloir supprimer cet utilisateur?</p>
              </Modal.Body>
              <Modal.Footer>
                <Button variant="secondary" onClick={() => setShowDeleteUser(false)}>
                  Annuler
                </Button>
                <Button variant="danger" onClick={handleDeleteUser}>
                  Supprimer
                </Button>
              </Modal.Footer>
            </Modal>
          </section>
        </div>
      </div>
    </div>
  );
};

export default Users;
