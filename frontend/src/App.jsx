import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importation des pages
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import DelegateDashboard from './pages/student/DelegateDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

// Composant de protection des routes
const ProtectedRoute = ({ children, allowedRoles }) => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');

    if (!token) {
        return <Navigate to="/login" replace />;
    }

    if (allowedRoles && !allowedRoles.includes(role)) {
        if (role === 'admin' || role === 'agent') return <Navigate to="/admin" replace />;
        if (role === 'delegue') return <Navigate to="/delegate" replace />;
        return <Navigate to="/student" replace />;
    }

    return children;
};

function App() {
    return (
        <Router>
            <Routes>
                {/* Page de connexion */}
                <Route path="/login" element={<Login />} />

                {/* Espace Étudiant */}
                <Route 
                    path="/student" 
                    element={
                        <ProtectedRoute allowedRoles={['etudiant']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Espace Délégué */}
                <Route 
                    path="/delegate" 
                    element={
                        <ProtectedRoute allowedRoles={['delegue']}>
                            <DelegateDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Espace Admin / Scolarité */}
                <Route 
                    path="/admin" 
                    element={
                        <ProtectedRoute allowedRoles={['admin', 'agent']}>
                            <AdminDashboard />
                        </ProtectedRoute>
                    } 
                />

                {/* Redirection par défaut */}
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;