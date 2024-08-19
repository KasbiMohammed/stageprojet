import React, { useState, useEffect } from 'react';
import { Button, Table, Modal, Form, Image } from 'react-bootstrap';
import axios from 'axios';
import Header from '../../layout/admin/Header';
import SideNave from '../../layout/admin/SideNave';
import jsPDF from 'jspdf'; 
import 'jspdf-autotable'; 

const Modifications = () => {
  const [modifications, setModifications] = useState([]);
  const [users, setUsers] = useState([]);
  const [showForm, setShowForm] = useState(false);
  const [formType, setFormType] = useState('add');
  const [currentModification, setCurrentModification] = useState(null);
  const [formData, setFormData] = useState({
    atelier: '',
    date: '',
    objet: '',
    description: '',
    service1: '',
    service2: '',
    photoAvantModification: null,
    photoApresModification: null,
    user: '',
  });
  const [showConfirm, setShowConfirm] = useState(false);
  const [modificationToExport, setModificationToExport] = useState(null);
  const [previewAvant, setPreviewAvant] = useState(null);
  const [previewApres, setPreviewApres] = useState(null);
  const [showSubmitConfirm, setShowSubmitConfirm] = useState(false);

  useEffect(() => {
    fetchModifications();
    fetchUsers();
  }, []);

  const fetchModifications = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/modifications');
      setModifications(response.data);
    } catch (error) {
      console.error('Error fetching modifications', error);
    }
  };

  const fetchUsers = async () => {
    try {
      const response = await axios.get('http://localhost:8081/api/users');
      setUsers(response.data);
    } catch (error) {
      console.error('Error fetching users', error);
    }
  };

  const handleFileChange = (event, key) => {
    setFormData({ ...formData, [key]: event.target.files[0] });
    const file = event.target.files[0];
    if (key === 'photoAvantModification') {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewAvant(reader.result);
      reader.readAsDataURL(file);
    } else if (key === 'photoApresModification') {
      const reader = new FileReader();
      reader.onloadend = () => setPreviewApres(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const readFileAsBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result.split(',')[1]);
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  const handleSubmit = async () => {
    let photoAvantBase64 = '';
    let photoApresBase64 = '';

    if (formData.photoAvantModification) {
      photoAvantBase64 = await readFileAsBase64(formData.photoAvantModification);
    }
    if (formData.photoApresModification) {
      photoApresBase64 = await readFileAsBase64(formData.photoApresModification);
    }

    const modification = {
      atelier: formData.atelier.trim(),
      date: formData.date.trim(),
      objet: formData.objet.trim(),
      description: formData.description.trim(),
      
      photoAvantModification: photoAvantBase64 || null,
      photoApresModification: photoApresBase64 || null,
      user: formData.user ? { id: formData.user } : null,
    };

    try {
      if (formType === 'edit' && currentModification) {
        await axios.put(`http://localhost:8081/api/modifications/${currentModification.id}`, modification, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      } else {
        await axios.post('http://localhost:8081/api/modifications', modification, {
          headers: {
            'Content-Type': 'application/json',
          },
        });
      }
      fetchModifications();
      handleFormReset();
      setShowSubmitConfirm(false); // Hide confirmation modal after submitting
    } catch (error) {
      console.error('Error saving modification', error);
    }
  };

  const handleFormReset = () => {
    setFormData({
      atelier: '',
      date: '',
      objet: '',
      description: '',
     
      photoAvantModification: null,
      photoApresModification: null,
      user: '',
    });
    setCurrentModification(null);
    setFormType('add');
    setShowForm(false);
    setPreviewAvant(null);
    setPreviewApres(null);
  };

  const handleExportToPDF = () => {
    if (modificationToExport) {
      const doc = new jsPDF();
      
      // Title of the document
      doc.setFontSize(18);
      doc.text('Fiche de Modification', 70, 20);
      
      // Basic information
      doc.setFontSize(12);
      doc.text(`Lieu: ${modificationToExport.atelier}`, 10, 40);
      doc.text(`Date: ${modificationToExport.date}`, 10, 50);
      doc.text(`Modifié par: ${modificationToExport.user.nom} ${modificationToExport.user.prenom}`, 10, 60);
  
      // Main table
      doc.autoTable({
        startY: 70,
        head: [['Atelier', 'Date']],
        body: [[modificationToExport.atelier, modificationToExport.date]],
        theme: 'striped',
      });
  
      // Description of the modification
      doc.text('Description de la Modification', 10, doc.lastAutoTable.finalY + 10);
      doc.autoTable({
        startY: doc.lastAutoTable.finalY + 20,
        head: [['Objet', 'Description']],
        body: [[modificationToExport.objet, modificationToExport.description]],
        theme: 'striped',
      });
  
      // Images before and after modification
      if (modificationToExport.photoAvantModification || modificationToExport.photoApresModification) {
        doc.text('Photos Avant et Après Modification', 10, doc.lastAutoTable.finalY + 20);
        
        const photoTableStartY = doc.lastAutoTable.finalY + 30;
  
        if (modificationToExport.photoAvantModification) {
          doc.addImage(`data:image/jpeg;base64,${modificationToExport.photoAvantModification}`, 'JPEG', 10, photoTableStartY, 90, 60);
        }
  
        if (modificationToExport.photoApresModification) {
          doc.addImage(`data:image/jpeg;base64,${modificationToExport.photoApresModification}`, 'JPEG', 110, photoTableStartY, 90, 60);
        }
      }
       // Spaces for signatures
       doc.text('Visa de Service ME&I', 10, doc.internal.pageSize.height - 30);
       doc.text('Visa du Service Production', doc.internal.pageSize.width - 90, doc.internal.pageSize.height - 30);

      doc.save('Modification.pdf');
    }
  };

  return (
    <div>
      <Header />
      <SideNave />
      <div>
        <div className="content-wrapper">
          <section className="content">
            <h2>Liste des Modifications</h2>
            <Table striped bordered hover>
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Atelier</th>
                  <th>Date</th>
                  <th>Objet</th>
                  <th>Description</th>
                 
                  <th>Photo Avant</th>
                  <th>Photo Après</th>
                  <th>Utilisateur</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {modifications.map((modification) => (
                  <tr key={modification.id}>
                    <td>{modification.id}</td>
                    <td>{modification.atelier}</td>
                    <td>{modification.date}</td>
                    <td>{modification.objet}</td>
                    <td>{modification.description}</td>
                   
                    <td>
                      {modification.photoAvantModification && (
                        <img src={`data:image/jpeg;base64,${modification.photoAvantModification}`} alt="Avant Modification" style={{ width: '50px', height: '50px' }} />
                      )}
                    </td>
                    <td>
                      {modification.photoApresModification && (
                        <img src={`data:image/jpeg;base64,${modification.photoApresModification}`} alt="Après Modification" style={{ width: '50px', height: '50px' }} />
                      )}
                    </td>
                    <td>{modification.user ? `${modification.user.nom} ${modification.user.prenom}` : 'N/A'}</td>
                    <td>
                      <Button
                        variant="info"
                        onClick={() => {
                          setCurrentModification(modification);
                          setModificationToExport(modification); // Set the modification to export
                          setFormType('edit');
                          setShowForm(true);
                        }}
                      >
                        Modifier
                      </Button>
                      {' '}
                      {/* <Button
                        variant="danger"
                        onClick={() => {
                          setCurrentModification(modification);
                          setShowConfirm(true);
                        }}
                      >
                        Supprimer
                      </Button> */}
                      {' '}
                      <Button
                        variant="primary"
                        onClick={() => {
                          setModificationToExport(modification); // Set the modification to export
                          handleExportToPDF();
                        }}
                      >
                        Exporter en PDF
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </Table>
            <Button variant="primary" onClick={() => {
              setFormType('add');
              setShowForm(true);
            }}>
              Ajouter une Modification
            </Button>
          </section>
        </div>
      </div>

      <Modal show={showForm} onHide={handleFormReset}>
        <Modal.Header closeButton>
          <Modal.Title>{formType === 'add' ? 'Ajouter une Modification' : 'Modifier une Modification'}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group controlId="formAtelier">
              <Form.Label>Atelier</Form.Label>
              <Form.Control
                type="text"
                placeholder="Saisir l'atelier"
                value={formData.atelier}
                onChange={(e) => setFormData({ ...formData, atelier: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formDate">
              <Form.Label>Date</Form.Label>
              <Form.Control
                type="date"
                placeholder="Saisir la date"
                value={formData.date}
                onChange={(e) => setFormData({ ...formData, date: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formObjet">
              <Form.Label>Objet</Form.Label>
              <Form.Control
                type="text"
                placeholder="Saisir l'objet"
                value={formData.objet}
                onChange={(e) => setFormData({ ...formData, objet: e.target.value })}
              />
            </Form.Group>

            <Form.Group controlId="formDescription">
              <Form.Label>Description</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Saisir la description"
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              />
            </Form.Group>

            

            <Form.Group controlId="formUser">
              <Form.Label>Utilisateur</Form.Label>
              <Form.Control
                as="select"
                value={formData.user}
                onChange={(e) => setFormData({ ...formData, user: e.target.value })}
              >
                <option value="">Sélectionner un utilisateur</option>
                {users.map((user) => (
                  <option key={user.id} value={user.id}>
                    {user.nom} {user.prenom}
                  </option>
                ))}
              </Form.Control>
            </Form.Group>

            <Form.Group>
              <Form.Label>Photo Avant Modification</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'photoAvantModification')}
              />
              {previewAvant && <Image src={previewAvant} thumbnail />}
            </Form.Group>

            <Form.Group>
              <Form.Label>Photo Après Modification</Form.Label>
              <Form.Control
                type="file"
                onChange={(e) => handleFileChange(e, 'photoApresModification')}
              />
              {previewApres && <Image src={previewApres} thumbnail />}
            </Form.Group>

            <Button variant="primary" onClick={() => setShowSubmitConfirm(true)}>
              {formType === 'add' ? 'Ajouter' : 'Modifier'}
            </Button>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={handleFormReset}>
            Annuler
          </Button>
        </Modal.Footer>
      </Modal>

      {/* <Modal show={showConfirm} onHide={() => setShowConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir supprimer cette modification ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowConfirm(false)}>
            Annuler
          </Button> */}
          {/* <Button
            variant="danger"
            onClick={async () => {
              try {
                if (currentModification) {
                  await axios.delete(`http://localhost:8081/api/modifications/${currentModification.id}`);
                  fetchModifications();
                }
              } catch (error) {
                console.error('Error deleting modification', error);
              }
              setShowConfirm(false);
            }}
          >
            Supprimer
          </Button> */}
        {/* </Modal.Footer>
      </Modal> */}

      <Modal show={showSubmitConfirm} onHide={() => setShowSubmitConfirm(false)}>
        <Modal.Header closeButton>
          <Modal.Title>Confirmation</Modal.Title>
        </Modal.Header>
        <Modal.Body>Êtes-vous sûr de vouloir {formType === 'add' ? 'ajouter' : 'modifier'} cette modification ?</Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowSubmitConfirm(false)}>
            Annuler
          </Button>
          <Button
            variant="primary"
            onClick={handleSubmit}
          >
            {formType === 'add' ? 'Ajouter' : 'Modifier'}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
};

export default Modifications;
