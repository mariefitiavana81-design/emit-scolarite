import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmit from '../../assets/emit-logo.png.jpg';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    
    // Liste des demandes de l'étudiant
    const [demandes, setDemandes] = useState([
        { id: 1, type: "Certificat de scolarité", motif: "Dossier de bourse", date: "2026-09-04", statut: "En cours de traitement" },
        { id: 2, type: "Relevé de notes", motif: "Inscription concours", date: "2026-08-20", statut: "Validée / Prête" }
    ]);

    // Champs pour le formulaire "Nouvelle demande"
    const [typeDocument, setTypeDocument] = useState('Certificat de scolarité');
    const [motif, setMotif] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    // Champs pour la modification du Profil
    const [nom, setNom] = useState('RAHARINILANTO Anna Alexis');
    const [email, setEmail] = useState('anna.alexis@it-university.mg');
    const [currentPassword, setCurrentPassword] = useState('');
    const [newPassword, setNewPassword] = useState('');
    const [profilMsg, setProfilMsg] = useState('');

    const navigate = useNavigate();

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleActualiser = () => {
        window.location.reload();
    };

    const handleSoumettreDemande = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const nouvelleDemande = {
                id: demandes.length + 1,
                type: typeDocument,
                motif: motif || 'Demande officielle',
                date: new Date().toISOString().split('T')[0],
                statut: 'En cours de traitement'
            };
            setDemandes([nouvelleDemande, ...demandes]);
            setLoading(false);
            setSuccessMsg('Votre demande a été soumise avec succès à la scolarité.');
            setMotif('');
            setActiveTab('dashboard');
            setTimeout(() => setSuccessMsg(''), 5000);
        }, 800);
    };

    const handleUpdateProfil = (e) => {
        e.preventDefault();
        setProfilMsg('Modifications enregistrées avec succès !');
        setTimeout(() => setProfilMsg(''), 4000);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            
            {/* Sidebar Left (Textes de catégories supprimés pour un rendu épuré) */}
            <aside style={{ width: '260px', background: '#0f172a', borderRight: '1px solid #1e293b', display: 'flex', flexDirection: 'column', flexShrink: '0' }}>
                <div style={{ padding: '20px 24px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img src={logoEmit} alt="EMIT Logo" style={{ height: '45px', width: 'auto', objectFit: 'contain' }} />
                </div>

                <div style={{ padding: '24px 16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <button 
                        onClick={() => setActiveTab('dashboard')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'dashboard' ? '#2563eb' : 'transparent',
                            color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        📊 Tableau de bord
                    </button>
                    
                    <button 
                        onClick={() => setActiveTab('mes-demandes')}
                        style={{
                            display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'mes-demandes' ? '#2563eb' : 'transparent',
                            color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>📁 Mes Demandes</span>
                        <span style={{ background: '#1e293b', color: '#fff', padding: '2px 8px', borderRadius: '10px', fontSize: '12px' }}>{demandes.length}</span>
                    </button>

                    <button 
                        onClick={() => setActiveTab('nouvelle-demande')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'nouvelle-demande' ? '#2563eb' : 'transparent',
                            color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        ➕ Nouvelle demande
                    </button>

                    <button 
                        onClick={() => setActiveTab('profil')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'profil' ? '#2563eb' : 'transparent',
                            color: '#ffffff', fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        ⚙️ Profil & Paramètres
                    </button>
                </div>
            </aside>

            {/* Main Area */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <header style={{ padding: '16px 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '16px' }}>
                    
                    <button style={{ padding: '8px 10px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '8px', cursor: 'pointer', position: 'relative' }}>
                        🔔
                        <span style={{ position: 'absolute', top: '4px', right: '4px', width: '8px', height: '8px', background: '#ef4444', borderRadius: '50%' }}></span>
                    </button>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '6px 16px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                            RA
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>RAHARINILANTO Anna Alexis</p>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Espace Étudiant</p>
                        </div>
                    </div>

                    <button 
                        onClick={handleActualiser}
                        style={{
                            padding: '8px 14px', background: '#f8fafc', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '8px',
                            fontWeight: '600', fontSize: '13px', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px'
                        }}
                    >
                        🔄 Actualiser
                    </button>

                    <button 
                        onClick={handleLogout}
                        style={{
                            padding: '8px 16px', background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', borderRadius: '8px',
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

                    {/* 1. TABLEAU DE BORD */}
                    {activeTab === 'dashboard' && (
                        <div>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '32px' }}>
                                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 6px 0' }}>En cours</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#b45309', margin: 0 }}>
                                            {demandes.filter(d => d.statut.includes('En cours')).length}
                                        </h3>
                                    </div>
                                    <div style={{ fontSize: '24px', background: '#fef3c7', padding: '10px', borderRadius: '12px' }}>⏳</div>
                                </div>
                                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 6px 0' }}>Prêtes / Validées</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#15803d', margin: 0 }}>
                                            {demandes.filter(d => d.statut.includes('Validée') || d.statut.includes('Prête')).length}
                                        </h3>
                                    </div>
                                    <div style={{ fontSize: '24px', background: '#dcfce7', padding: '10px', borderRadius: '12px' }}>✅</div>
                                </div>
                                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 6px 0' }}>Total demandes</p>
                                        <h3 style={{ fontSize: '24px', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>{demandes.length}</h3>
                                    </div>
                                    <div style={{ fontSize: '24px', background: '#eff6ff', padding: '10px', borderRadius: '12px' }}>📁</div>
                                </div>
                                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <p style={{ fontSize: '12px', fontWeight: '600', color: '#64748b', margin: '0 0 6px 0' }}>Niveau Actuel</p>
                                        <h3 style={{ fontSize: '22px', fontWeight: '800', color: '#0f172a', margin: 0 }}>L2 - GB</h3>
                                    </div>
                                    <div style={{ fontSize: '24px', background: '#f8fafc', padding: '10px', borderRadius: '12px' }}>🎓</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Dernières demandes soumises</h3>
                                        <button onClick={() => setActiveTab('mes-demandes')} style={{ background: 'transparent', border: 'none', color: '#2563eb', fontWeight: '600', fontSize: '13px', cursor: 'pointer' }}>
                                            Voir tout →
                                        </button>
                                    </div>

                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                        {demandes.map(d => (
                                            <div key={d.id} style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #e2e8f0', position: 'relative' }}>
                                                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                    <span style={{ fontSize: '11px', fontWeight: '700', padding: '4px 10px', borderRadius: '6px', background: d.statut.includes('En cours') ? '#fef3c7' : '#dcfce7', color: d.statut.includes('En cours') ? '#b45309' : '#15803d' }}>
                                                        {d.statut}
                                                    </span>
                                                    <span style={{ fontSize: '12px', color: '#64748b' }}>{d.date}</span>
                                                </div>
                                                <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0', textAlign: 'center' }}>{d.type}</h4>
                                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0, textAlign: 'center' }}>Motif : {d.motif}</p>
                                            </div>
                                        ))}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                                    <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 12px 0', textAlign: 'center' }}>Retrait des cartes</h3>
                                        <p style={{ fontSize: '13px', color: '#475569', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
                                            Le bureau de la scolarité est ouvert du lundi au vendredi de 8h00 à 15h00.
                                        </p>
                                    </div>
                                    <div style={{ background: '#fef9c3', padding: '24px', borderRadius: '16px', border: '1px solid #fde047' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#854d0e', margin: '0 0 12px 0', textAlign: 'center' }}>Délai de traitement</h3>
                                        <p style={{ fontSize: '13px', color: '#713f12', textAlign: 'center', margin: 0, lineHeight: '1.5' }}>
                                            Comptez 48h ouvrées pour la validation d'un certificat ou relevé de notes.
                                        </p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* 2. MES DEMANDES */}
                    {activeTab === 'mes-demandes' && (
                        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Historique de mes demandes</h2>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Suivi en temps réel de vos requêtes administratives auprès de la scolarité.</p>
                                </div>
                                <button 
                                    onClick={() => setActiveTab('nouvelle-demande')}
                                    style={{ background: '#2563eb', color: '#fff', border: 'none', padding: '10px 18px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                                >
                                    + Nouvelle demande
                                </button>
                            </div>

                            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '14px' }}>
                                <thead>
                                    <tr style={{ background: '#f8fafc', color: '#64748b', borderBottom: '1px solid #e2e8f0' }}>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>TYPE DE DEMANDE</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>MOTIF</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>DATE DE SOUMISSION</th>
                                        <th style={{ padding: '12px 16px', fontWeight: '600' }}>STATUT ACTUEL</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {demandes.map(d => (
                                        <tr key={d.id} style={{ borderBottom: '1px solid #f1f5f9' }}>
                                            <td style={{ padding: '16px', color: '#0f172a', fontWeight: '600', display: 'flex', alignItems: 'center', gap: '8px' }}>
                                                📄 {d.type}
                                            </td>
                                            <td style={{ padding: '16px', color: '#475569' }}>{d.motif}</td>
                                            <td style={{ padding: '16px', color: '#64748b' }}>{d.date}</td>
                                            <td style={{ padding: '16px' }}>
                                                <span style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700', background: d.statut.includes('En cours') ? '#fef3c7' : '#dcfce7', color: d.statut.includes('En cours') ? '#b45309' : '#15803d' }}>
                                                    {d.statut}
                                                </span>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}

                    {/* 3. NOUVELLE DEMANDE */}
                    {activeTab === 'nouvelle-demande' && (
                        <div style={{ background: '#ffffff', padding: '40px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '750px', margin: '0 auto' }}>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📄✍️</div>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Effectuer une nouvelle demande</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Remplissez ce formulaire pour soumettre votre requête officielle au service de la scolarité.</p>
                            </div>

                            <form onSubmit={handleSoumettreDemande}>
                                <div style={{ marginBottom: '20px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#0f172a', textAlign: 'center' }}>
                                        Type de document demandé :
                                    </label>
                                    <select 
                                        value={typeDocument} 
                                        onChange={(e) => setTypeDocument(e.target.value)}
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', background: '#fff', outline: 'none' }}
                                    >
                                        <option value="Certificat de scolarité">Certificat de scolarité</option>
                                        <option value="Relevé de notes">Relevé de notes</option>
                                        <option value="Attestation de réussite">Attestation de réussite</option>
                                    </select>
                                </div>

                                <div style={{ marginBottom: '24px' }}>
                                    <label style={{ display: 'block', marginBottom: '8px', fontWeight: '700', fontSize: '13px', color: '#0f172a', textAlign: 'center' }}>
                                        Motif de la demande :
                                    </label>
                                    <textarea 
                                        rows="4" 
                                        value={motif} 
                                        onChange={(e) => setMotif(e.target.value)} 
                                        required
                                        placeholder="Ex: Dossier de bourse, inscription concours, dossier bancaire..."
                                        style={{ width: '100%', padding: '12px 16px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', outline: 'none', resize: 'vertical', boxSizing: 'border-box' }}
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px' }}>
                                    <button 
                                        type="submit" 
                                        disabled={loading}
                                        style={{ 
                                            flex: 1, background: '#2563eb', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', 
                                            fontWeight: '700', fontSize: '14px', cursor: 'pointer', textAlign: 'center' 
                                        }}
                                    >
                                        {loading ? 'Envoi en cours...' : '🚀 Soumettre la demande'}
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setActiveTab('dashboard')}
                                        style={{ 
                                            background: '#f1f5f9', color: '#334155', border: '1px solid #cbd5e1', padding: '14px 24px', borderRadius: '10px', 
                                            fontWeight: '700', fontSize: '14px', cursor: 'pointer' 
                                        }}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* 4. PROFIL & PARAMÈTRES */}
                    {activeTab === 'profil' && (
                        <div>
                            <div style={{ textAlign: 'center', marginBottom: '24px' }}>
                                <h2 style={{ fontSize: '20px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>Profil & Paramètres</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Modifier vos informations personnelles</p>
                            </div>

                            {profilMsg && (
                                <div style={{ background: '#f0fdf4', color: '#166534', padding: '12px', borderRadius: '8px', marginBottom: '20px', textAlign: 'center', fontWeight: '600' }}>
                                    {profilMsg}
                                </div>
                            )}

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '32px' }}>
                                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', textAlign: 'center', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
                                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#0f172a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '800', fontSize: '24px', margin: '0 auto' }}>
                                            RA
                                        </div>
                                        <span style={{ position: 'absolute', bottom: '4px', right: '4px', width: '14px', height: '14px', background: '#22c55e', border: '2px solid #fff', borderRadius: '50%' }}></span>
                                    </div>
                                    <h3 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0' }}>{nom}</h3>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 16px 0' }}>L2 - GB</p>
                                    
                                    <div style={{ borderTop: '1px solid #f1f5f9', width: '100%', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>✉️ {email}</p>
                                        <p style={{ fontSize: '13px', color: '#475569', margin: 0 }}>🎓 Gestion académique (L2)</p>
                                    </div>
                                </div>

                                <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 20px 0', textAlign: 'center' }}>Modifier mes informations</h3>
                                    
                                    <form onSubmit={handleUpdateProfil}>
                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Nom complet</label>
                                            <input 
                                                type="text" 
                                                value={nom} 
                                                onChange={(e) => setNom(e.target.value)} 
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Email</label>
                                            <input 
                                                type="email" 
                                                value={email} 
                                                onChange={(e) => setEmail(e.target.value)} 
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '16px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Mot de passe actuel</label>
                                            <input 
                                                type="password" 
                                                placeholder="Requis pour changer le mot de passe"
                                                value={currentPassword} 
                                                onChange={(e) => setCurrentPassword(e.target.value)} 
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ marginBottom: '24px' }}>
                                            <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#475569', marginBottom: '6px' }}>Nouveau mot de passe (min. 8 caractères)</label>
                                            <input 
                                                type="password" 
                                                placeholder="••••••••"
                                                value={newPassword} 
                                                onChange={(e) => setNewPassword(e.target.value)} 
                                                style={{ width: '100%', padding: '10px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '14px', boxSizing: 'border-box', outline: 'none' }}
                                            />
                                        </div>

                                        <div style={{ display: 'flex', gap: '12px' }}>
                                            <button 
                                                type="submit" 
                                                style={{ background: '#0f172a', color: '#fff', border: 'none', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                💾 Enregistrer
                                            </button>
                                            <button 
                                                type="button" 
                                                onClick={handleLogout}
                                                style={{ background: '#fef2f2', color: '#ef4444', border: '1px solid #fecaca', padding: '12px 20px', borderRadius: '8px', fontWeight: '700', fontSize: '13px', cursor: 'pointer' }}
                                            >
                                                🚪 Déconnexion
                                            </button>
                                        </div>
                                    </form>
                                </div>
                            </div>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}