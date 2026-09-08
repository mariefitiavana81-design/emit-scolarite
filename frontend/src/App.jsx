// frontend/src/App.jsx
import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Login from './pages/Login';
import StudentDashboard from './pages/student/StudentDashboard';
import DelegateDashboard from './pages/student/DelegateDashboard';

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
                <Route path="/login" element={<Login />} />

                <Route 
                    path="/student" 
                    element={
                        <ProtectedRoute allowedRoles={['etudiant']}>
                            <StudentDashboard />
                        </ProtectedRoute>
                    } 
                />

                <Route 
                    path="/delegate" 
                    element={
                        <ProtectedRoute allowedRoles={['delegue']}>
                            <DelegateDashboard />
                        </ProtectedRoute>
                    } 
                />

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

                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        </Router>
    );
}

export default App;