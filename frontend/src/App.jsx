import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';

// Importation de tes pages
import StudentDashboard from './pages/student/StudentDashboard';
import AdminDashboard from './pages/admin/AdminDashboard';

function App() {
  return (
    <Router>
      <Routes>
        {/* Redirection vers ton espace administration par défaut */}
        <Route path="/" element={<Navigate to="/admin/dashboard" replace />} />

        {/* Ta partie : Binôme B (Administration & Scolarité) */}
        <Route path="/admin/dashboard" element={<AdminDashboard />} />

        {/* Partie de ta binôme : Espace Étudiant */}
        <Route path="/student/dashboard" element={<StudentDashboard />} />

        {/* Gestion erreur 404 */}
        <Route path="*" element={<div style={{ padding: '20px' }}>Page non trouvée</div>} />
      </Routes>
    </Router>
  );
}

export default App;