import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmit from '../../assets/emit-logo.png.jpg';

export default function DelegateDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Suivi des demandes de la classe
    const [demandesClasse, setDemandesClasse] = useState([
        { id: 101, type: "Demande groupée de relevés de notes", date: "2026-09-04", statut: "En cours de traitement", promotion: "L3 Informatique" },
        { id: 102, type: "Certificats de scolarité collectifs", date: "2026-09-10", statut: "Validée", promotion: "L3 Informatique" }
    ]);

    // Liste des étudiants de la promotion
    const [etudiantsPromotion, setEtudiantsPromotion] = useState([
        { id: 1, matricule: "ET 001", nom: "Rakoto Jean", parcours: "Génie Logiciel", statut: "Inscrit" },
        { id: 2, matricule: "ET 002", nom: "Rasoa Marie", parcours: "Génie Logiciel", statut: "Inscrit" }
    ]);

    // Champs pour "Nouvelles demandes"
    const [typeDemande, setTypeDemande] = useState('Relevé de notes global de la promotion');
    const [anneeAcademique, setAnneeAcademique] = useState('2025-2026');
    const [motif, setMotif] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Notifications & Actualisation
    const [showNotifications, setShowNotifications] = useState(false);
    const [notificationsList, setNotificationsList] = useState([
        { id: 1, title: "Traitement de demande", date: "2026-09-10", message: "La demande groupée de relevés de notes a été prise en compte par la scolarité." }
    ]);
    const [refreshing, setRefreshing] = useState(false);

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleActualiser = () => {
        setRefreshing(true);
        setTimeout(() => {
            setRefreshing(false);
        }, 600);
    };

    const handleSoumettreNouvelleDemande = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const nouvelleDemande = {
                id: demandesClasse.length + 101,
                type: `Requête : ${typeDemande}`,
                date: new Date().toISOString().split('T')[0],
                statut: 'Soumise',
                promotion: 'L3 Informatique'
            };
            setDemandesClasse([nouvelleDemande, ...demandesClasse]);
            setLoading(false);
            setSuccessMsg('Nouvelle demande transmise avec succès à la scolarité pour le compte de la promotion.');
            setMotif('');
            setActiveTab('dashboard');
            setTimeout(() => setSuccessMsg(''), 5000);
        }, 800);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            
            {/* Sidebar Left */}
            <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: '0' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoEmit} alt="EMIT Logo" style={{ height: '50px', width: 'auto', objectFit: 'contain' }} />
                </div>

                <div style={{ padding: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Principal
                </div>
                <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'dashboard' ? '#1e3a8a' : 'transparent',
                            color: activeTab === 'dashboard' ? '#ffffff' : '#475569',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        📊 Dashboard
                    </button>
                    <button 
                        onClick={() => setActiveTab('nouvelles-demandes')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'nouvelles-demandes' ? '#1e3a8a' : 'transparent',
                            color: activeTab === 'nouvelles-demandes' ? '#ffffff' : '#475569',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        ➕ Nouvelles demandes
                    </button>
                </div>

                <div style={{ padding: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gestion Promotion
                </div>
                <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                        onClick={() => setActiveTab('etudiants')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'etudiants' ? '#1e3a8a' : 'transparent',
                            color: activeTab === 'etudiants' ? '#ffffff' : '#475569',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        🎓 Étudiants de la classe
                    </button>
                </div>

                <div style={{ padding: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Compte
                </div>
                <div style={{ padding: '0 12px' }}>
                    <button 
                        onClick={() => setActiveTab('profil')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'profil' ? '#1e3a8a' : 'transparent',
                            color: activeTab === 'profil' ? '#ffffff' : '#475569',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        ⚙️ Profil & Paramètres
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <header style={{ padding: '16px 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                    
                    {/* Notifications */}
                    <div style={{ position: 'relative' }}>
                        <button 
                            onClick={() => setShowNotifications(!showNotifications)}
                            style={{
                                padding: '8px 12px', background: '#f8fafc', color: '#334155', border: '1px solid #e2e8f0', borderRadius: '8px',
                                fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', position: 'relative'
                            }}
                        >
                            🔔 Notifications
                            {notificationsList.length > 0 && (
                                <span style={{ background: '#ef4444', color: '#fff', borderRadius: '50%', padding: '2px 6px', fontSize: '10px', fontWeight: '700' }}>
                                    {notificationsList.length}
                                </span>
                            )}
                        </button>

                        {showNotifications && (
                            <div style={{
                                position: 'absolute', right: 0, top: '42px', width: '320px', background: '#ffffff',
                                border: '1px solid #e2e8f0', borderRadius: '12px', boxShadow: '0 10px 25px rgba(0,0,0,0.1)', zIndex: 100, padding: '16px'
                            }}>
                                <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#0f172a', margin: '0 0 12px 0', borderBottom: '1px solid #f1f5f9', paddingBottom: '8px' }}>
                                    Notifications de la Scolarité
                                </h3>
                                {notificationsList.map(notif => (
                                    <div key={notif.id} style={{ padding: '10px', background: '#f8fafc', borderRadius: '8px', border: '1px solid #e2e8f0', marginBottom: '8px' }}>
                                        <p style={{ fontSize: '12px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>{notif.title} ({notif.date})</p>
                                        <p style={{ fontSize: '12px', color: '#334155', margin: 0 }}>{notif.message}</p>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Profil Utilisateur (Badge) */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e3a8a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                            {user.nom ? user.nom.substring(0, 2).toUpperCase() : 'DL'}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{user.nom || 'Délégué Promotion'}</p>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Espace Délégué</p>
                        </div>
                    </div>

                    {/* Bouton Actualiser (placé immédiatement devant Déconnexion) */}
                    <button 
                        onClick={handleActualiser}
                        disabled={refreshing}
                        style={{
                            padding: '8px 14px', background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', borderRadius: '8px',
                            fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        {refreshing ? '⏳ Actualisation...' : '🔄 Actualiser'}
                    </button>

                    {/* Bouton Déconnexion */}
                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px', background: '#ffffff', color: '#ef4444', border: '1px solid #e2e8f0', borderRadius: '8px',
                            fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        🚪 Déconnexion
                    </button>
                </header>

                <div style={{ padding: '32px' }}>
                    {successMsg && (
                        <div style={{ background: '#f0fdf4', color: '#166534', padding: '14px 20px', borderRadius: '12px', marginBottom: '24px', border: '1px solid #bbf7d0', fontWeight: '600', fontSize: '14px' }}>
                            ✅ {successMsg}
                        </div>
                    )}

                    {/* ONGLET 1: DASHBOARD */}
                    {activeTab === 'dashboard' && (
                        <div>
                            {/* Cartes de synthèse de la promotion */}
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))', gap: '20px', marginBottom: '32px' }}>
                                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Total Requêtes Promotion</p>
                                    <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>{demandesClasse.length}</h3>
                                </div>
                                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0' }}>En cours de traitement</p>
                                    <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#d97706', margin: 0 }}>
                                        {demandesClasse.filter(d => d.statut === 'En cours de traitement').length}
                                    </h3>
                                </div>
                                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                    <p style={{ fontSize: '12px', fontWeight: '700', color: '#64748b', textTransform: 'uppercase', margin: '0 0 8px 0' }}>Validées / Traitées</p>
                                    <h3 style={{ fontSize: '28px', fontWeight: '800', color: '#166534', margin: 0 }}>
                                        {demandesClasse.filter(d => d.statut === 'Validée').length}
                                    </h3>
                                </div>
                            </div>

                            {/* Tableau de suivi des demandes */}
                            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Suivi des demandes de la promotion</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Historique et état d'avancement des requêtes collectives de la classe.</p>
                                
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                    <thead>
                                        <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Référence / Type</th>
                                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Promotion</th>
                                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Date</th>
                                            <th style={{ padding: '12px 16px', fontWeight: '600' }}>Statut</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {demandesClasse.map((d) => (
                                            <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                                <td style={{ padding: '16px', color: '#1e293b', fontWeight: '600' }}>{d.type}</td>
                                                <td style={{ padding: '16px', color: '#475569' }}>{d.promotion}</td>
                                                <td style={{ padding: '16px', color: '#64748b' }}>{d.date}</td>
                                                <td style={{ padding: '16px' }}>
                                                    <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#eff6ff', color: '#1e40af' }}>
                                                        {d.statut}
                                                    </span>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* ONGLET 2: NOUVELLES DEMANDES */}
                    {activeTab === 'nouvelles-demandes' && (
                        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Créer une Nouvelle Demande</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>Soumettez une requête officielle groupée au nom de toute votre promotion auprès de la scolarité.</p>

                            <form onSubmit={handleSoumettreNouvelleDemande}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', color: '#334155', textTransform: 'uppercase' }}>
                                        Objet / Type de demande collective
                                    </label>
                                    <input 
                                        type="text" 
                                        value={typeDemande} 
                                        onChange={(e) => setTypeDemande(e.target.value)} 
                                        required 
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', color: '#334155', textTransform: 'uppercase' }}>
                                        Année académique
                                    </label>
                                    <input 
                                        type="text" 
                                        value={anneeAcademique} 
                                        onChange={(e) => setAnneeAcademique(e.target.value)} 
                                        required 
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none' }}
                                    />
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '12px', color: '#334155', textTransform: 'uppercase' }}>
                                        Motif détaillé de la requête
                                    </label>
                                    <textarea 
                                        rows="4" 
                                        value={motif} 
                                        onChange={(e) => setMotif(e.target.value)} 
                                        required
                                        placeholder="Expliquez clairement la raison de cette demande..."
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', boxSizing: 'border-box', fontSize: '14px', outline: 'none', resize: 'vertical' }}
                                    />
                                </div>

                                <button 
                                    type="submit" 
                                    disabled={loading}
                                    style={{ 
                                        background: '#1e3a8a', color: '#ffffff', border: 'none', padding: '14px 24px', borderRadius: '10px', 
                                        fontWeight: '700', fontSize: '14px', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30,58,138,0.2)' 
                                    }}
                                >
                                    {loading ? 'Envoi en cours...' : 'Envoyer la nouvelle demande'}
                                </button>
                            </form>
                        </div>
                    )}

                    {/* ONGLET 3: ÉTUDIANTS DE LA CLASSE */}
                    {activeTab === 'etudiants' && (
                        <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Liste des étudiants de votre promotion</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Répertoire de la classe représentée.</p>
                            
                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Matricule</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Nom et Prénoms</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Parcours</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>Statut</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {etudiantsPromotion.map((etu) => (
                                        <tr key={etu.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px', color: '#1e293b', fontWeight: '600' }}>{etu.matricule}</td>
                                            <td style={{ padding: '16px', color: '#475569' }}>{etu.nom}</td>
                                            <td style={{ padding: '16px', color: '#64748b' }}>{etu.parcours}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: '#f0fdf4', color: '#166534' }}>
                                                    {etu.statut}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* ONGLET 4: PROFIL & PARAMÈTRES (IDENTIQUE À L'ÉTUDIANT) */}
                    {activeTab === 'profil' && (
                        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Mon Profil & Paramètres</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>Informations personnelles de votre compte délégué.</p>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '14px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Nom complet</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{user.nom || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '14px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Adresse Email</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#0f172a' }}>{user.email || 'N/A'}</span>
                                </div>
                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', padding: '14px 0', borderBottom: '1px solid #f1f5f9', alignItems: 'center' }}>
                                    <span style={{ fontSize: '13px', fontWeight: '700', color: '#64748b' }}>Rôle du compte</span>
                                    <span style={{ fontSize: '14px', fontWeight: '600', color: '#1e3a8a' }}>Délégué de promotion</span>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}