// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Composant pour protéger les routes en fonction du rôle
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        // Rediriger vers l'espace approprié si le rôle n'a pas les droits
        return <Navigate to={role === 'admin' || role === 'agent' ? '/admin' : '/student'} replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Route publique de connexion */}
                <Route path="/login" element={<Login />} />

                {/* Routes protégées Étudiant & Délégué (Votre partie) */}
                <Route 
                    path="/student" 
                    element={
                        <ProtectedRoute allowedRoles={['etudiant', 'delegue']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Routes protégées Admin & Agent (Partie de votre collègue) */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'agent']}>
                            <div style={{ padding: '20px', fontFamily: 'Arial' }}>
                                <h2>Tableau de Bord Administration & Scolarité</h2>
                                <p>Module géré par votre binôme.</p>
                            </div>
                        </ProtectedRoute>
                    } 
                />

                {/* Redirection par défaut vers /login */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;