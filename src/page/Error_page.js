import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import Navbar from '../layout/Navbar';
import Footer from '../layout/Footer';

export default function Home() {
    const navigate = useNavigate();

    return (
        <div>
            <Navbar />
            {/* Ajout d'un espace en haut */}
            <div className="home-banner" style={{ paddingTop: '100px' }}>
                <div className="container">
                    <div className="row">
                        <div className="col-lg-12 text-center">
                            <h1 className="display-4">Bienvenue sur la Plateforme de Gestion des Modifications</h1>
                            <p className="lead mt-4">Optimisez la gestion des modifications au sein du site de production OCP Jorf Lasfar.</p>
                            <Link to="/Login" className="btn btn-primary btn-lg mt-4">Commencer</Link>
                        </div>
                    </div>
                </div>
            </div>

            <div className="features-section py-5">
                <div className="container">
                    <div className="row text-center">
                        <div className="col-lg-4">
                            <div className="feature-box">
                                <i className="fas fa-tools fa-3x mb-3"></i>
                                <h3>Gestion Efficace</h3>
                                <p>Suivez et gérez les modifications en temps réel avec une interface intuitive.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="feature-box">
                                <i className="fas fa-file-alt fa-3x mb-3"></i>
                                <h3>Documentation Complète</h3>
                                <p>Archivez les modifications avant et après pour une traçabilité optimale.</p>
                            </div>
                        </div>
                        <div className="col-lg-4">
                            <div className="feature-box">
                                <i className="fas fa-user-shield fa-3x mb-3"></i>
                                <h3>Sécurité Renforcée</h3>
                                <p>Assurez la sécurité des opérations avec des validations et des rapports détaillés.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            <div className="cta-section bg-primary text-white py-5">
                <div className="container text-center">
                    <h2>Prêt à optimiser vos processus de modification ?</h2>
                    <p className="mt-3">Rejoignez notre plateforme et commencez dès maintenant à gérer vos modifications de manière plus efficace.</p>
                    {/* Bouton "Créer un compte" avec les mêmes styles que "Commencer" */}
                    <Link to="/Registre" className="btn btn-primary btn-lg mt-4">Créer un compte</Link>
                </div>
            </div>

            <Footer />
        </div>
    );
}
