import React from 'react';
import { useNavigate } from 'react-router-dom';

const LogoutButton = () => {
    const navigate = useNavigate();

    const handleLogout = () => {
        // Suppression des éléments d'authentification du localStorage
        localStorage.removeItem('token');
        localStorage.removeItem('role');
        localStorage.removeItem('user');

        // Redirection vers la page de connexion
        navigate('/login', { replace: true });
    };

    return (
        <button 
            onClick={handleLogout}
            style={{ 
                padding: '8px 14px', 
                background: '#dc3545', 
                color: '#fff', 
                border: 'none', 
                borderRadius: '4px', 
                fontWeight: 'bold', 
                cursor: 'pointer' 
            }}
        >
            Déconnexion
        </button>
    );
};

export default LogoutButton;