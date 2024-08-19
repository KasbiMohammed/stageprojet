import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';



import Login from './page/Login_User';
import Errore from './page/Error_page';
import Register from './page/Registre_User';


import Dashboard from './components/Dashboard';

import Users from './components/user/ListUsers';
import Modifications from './components/modifications/ListeModifications';


function App() {
    const isAdmin = localStorage.getItem('isAdmin') === '1';

    return (
        <Router>
            <div className="App">
                <Routes>
                   
                    <Route path="/login" element={<Login />} />
                    <Route path="/registre" element={<Register />} />
                    {isAdmin && (
                        <>
                            <Route path="/dashboard" element={<Dashboard />} />
                        </>
                    )}
                    {/* Routes pour les entités */}
                   <Route path='/users' element={<Users/>}/>
                   <Route path='/modifications' element={<Modifications/>}/>
                   
                    <Route path="*" element={<Errore />} />
                </Routes>
            </div>
        </Router>
    );
}

export default App;
