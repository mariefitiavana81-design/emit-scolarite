import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoEmit from '../assets/emit-logo.png.jpg';

const Login = () => {
    const [email, setEmail] = useState('');
    const [motDePasse, setMotDePasse] = useState('');
    const [error, setError] = useState('');
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const API_URL = 'http://localhost:5000/api/auth';

    const handleLogin = async (e) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const response = await axios.post(`${API_URL}/login`, {
                email,
                mot_de_passe: motDePasse
            });

            const { token, user } = response.data;
            
            // Récupération sécurisée du rôle peu importe sa structure dans la réponse backend
            const role = response.data.role || user?.role || user?.type_utilisateur || user?.type || 'etudiant';

            localStorage.setItem('token', token);
            localStorage.setItem('role', role);
            localStorage.setItem('user', JSON.stringify(user || {}));

            if (role === 'admin' || role === 'agent') {
                navigate('/admin');
            } else if (role === 'delegue') {
                navigate('/delegate'); // Redirige vers le dashboard spécifique du délégué
            } else if (role === 'etudiant') {
                navigate('/student');  // Redirige vers le dashboard de l'étudiant
            } else {
                navigate('/student');
            }
        } catch (err) {
            setError(err.response?.data?.error || err.response?.data?.message || 'Échec de la connexion. Vérifiez vos identifiants.');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{ 
            display: 'flex', 
            justifyContent: 'center', 
            alignItems: 'center', 
            minHeight: '100vh', 
            background: 'linear-gradient(135deg, #f1f5f9 0%, #cbd5e1 100%)',
            fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif',
            padding: '24px'
        }}>
            <div style={{ 
                background: '#ffffff', 
                padding: '48px 42px', 
                borderRadius: '24px', 
                boxShadow: '0 20px 45px -10px rgba(15, 23, 42, 0.1), 0 0 0 1px rgba(15, 23, 42, 0.04)', 
                width: '100%', 
                maxWidth: '460px',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                boxSizing: 'border-box'
            }}>
                <div style={{ marginBottom: '28px', textAlign: 'center' }}>
                    <img 
                        src={logoEmit} 
                        alt="EMIT Logo" 
                        style={{ 
                            height: '88px', 
                            width: 'auto', 
                            objectFit: 'contain',
                            filter: 'drop-shadow(0 4px 6px rgba(0,0,0,0.06))' 
                        }}
                    />
                </div>

                <div style={{ width: '100%', textAlign: 'center', marginBottom: '32px' }}>
                    <h2 style={{ fontSize: '24px', fontWeight: '800', color: '#0f172a', marginBottom: '8px', letterSpacing: '-0.03em' }}>
                        Espace Scolarité
                    </h2>
                    <p style={{ fontSize: '14px', color: '#64748b', lineHeight: '1.5', margin: 0 }}>
                        Connectez-vous pour gérer vos demandes et suivre votre parcours à l'EMIT.
                    </p>
                </div>

                {error && (
                    <div style={{ 
                        width: '100%',
                        background: '#fef2f2', 
                        color: '#991b1b', 
                        padding: '14px 18px', 
                        borderRadius: '12px', 
                        marginBottom: '24px', 
                        fontSize: '13px', 
                        border: '1px solid #fecaca',
                        fontWeight: '600',
                        boxSizing: 'border-box',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '8px'
                    }}>
                        <span>⚠️</span> {error}
                    </div>
                )}

                <form onSubmit={handleLogin} style={{ width: '100%' }}>
                    <div style={{ marginBottom: '20px' }}>
                        <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                            Adresse e-mail 
                        </label>
                        <input 
                            type="email" 
                            value={email} 
                            onChange={(e) => setEmail(e.target.value)} 
                            required 
                            style={{ 
                                width: '100%', 
                                padding: '14px 16px', 
                                borderRadius: '12px', 
                                border: '1px solid #cbd5e1', 
                                boxSizing: 'border-box',
                                fontSize: '14px',
                                color: '#1e293b',
                                background: '#f8fafc',
                                outline: 'none',
                                transition: 'all 0.25s ease'
                            }} 
                            onFocus={(e) => { e.target.style.borderColor = '#1e3a8a'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                            placeholder="votre.nom@emit.mg"
                        />
                    </div>

                    <div style={{ marginBottom: '28px' }}>
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                            <label style={{ fontWeight: '700', fontSize: '12px', color: '#334155', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                                Mot de passe
                            </label>
                        </div>
                        <input 
                            type="password" 
                            value={motDePasse} 
                            onChange={(e) => setMotDePasse(e.target.value)} 
                            required 
                            style={{ 
                                width: '100%', 
                                padding: '14px 16px', 
                                borderRadius: '12px', 
                                border: '1px solid #cbd5e1', 
                                boxSizing: 'border-box',
                                fontSize: '14px',
                                color: '#1e293b',
                                background: '#f8fafc',
                                outline: 'none',
                                transition: 'all 0.25s ease'
                            }} 
                            onFocus={(e) => { e.target.style.borderColor = '#1e3a8a'; e.target.style.background = '#fff'; e.target.style.boxShadow = '0 0 0 3px rgba(30, 58, 138, 0.1)'; }}
                            onBlur={(e) => { e.target.style.borderColor = '#cbd5e1'; e.target.style.background = '#f8fafc'; e.target.style.boxShadow = 'none'; }}
                            placeholder="••••••••"
                        />
                    </div>

                    <button 
                        type="submit" 
                        disabled={loading}
                        style={{ 
                            width: '100%', 
                            padding: '15px', 
                            background: '#1e3a8a', 
                            color: '#fff', 
                            border: 'none', 
                            borderRadius: '12px', 
                            fontWeight: '700', 
                            fontSize: '15px',
                            cursor: loading ? 'not-allowed' : 'pointer',
                            opacity: loading ? 0.7 : 1,
                            boxShadow: '0 4px 14px rgba(30, 58, 138, 0.3)',
                            transition: 'all 0.2s ease'
                        }}
                        onMouseOver={(e) => { if (!loading) { e.target.style.background = '#172554'; e.target.style.transform = 'translateY(-1px)'; } }}
                        onMouseOut={(e) => { if (!loading) { e.target.style.background = '#1e3a8a'; e.target.style.transform = 'translateY(0)'; } }}
                    >
                        {loading ? 'Connexion en cours...' : 'Se connecter'}
                    </button>
                </form>

                <div style={{ marginTop: '32px', paddingTop: '20px', borderTop: '1px solid #f1f5f9', width: '100%', textAlign: 'center' }}>
                    <p style={{ fontSize: '12px', color: '#94a3b8', margin: 0 }}>
                        En cas de difficultés d'accès, contactez l'administration de l'EMIT.
                    </p>
                </div>
            </div>
        </div>
    );
};

export default Login;