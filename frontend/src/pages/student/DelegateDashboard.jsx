import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmit from '../../assets/emit-logo.png.jpg';

export default function DelegateDashboard() {
    const [activeTab, setActiveTab] = useState('dashboard');
    const [demandesClasse, setDemandesClasse] = useState([
        { id: 101, type: "Demande groupée de relevés de notes", date: "2026-09-04", statut: "En cours de traitement", promotion: "L3 Informatique" }
    ]);

    const [typeDemande, setTypeDemande] = useState('Relevé de notes global de la promotion');
    const [anneeAcademique, setAnneeAcademique] = useState('2025-2026');
    const [motif, setMotif] = useState('');
    const [loading, setLoading] = useState(false);
    const [successMsg, setSuccessMsg] = useState('');

    const navigate = useNavigate();
    const user = JSON.parse(localStorage.getItem('user') || '{}');

    const handleLogout = () => {
        localStorage.clear();
        navigate('/login');
    };

    const handleSoumettreDemandeLibre = (e) => {
        e.preventDefault();
        setLoading(true);

        setTimeout(() => {
            const nouvelleDemande = {
                id: demandesClasse.length + 101,
                type: `Demande libre : ${typeDemande}`,
                date: new Date().toISOString().split('T')[0],
                statut: 'Soumise',
                promotion: 'Promotion Représentée'
            };
            setDemandesClasse([nouvelleDemande, ...demandesClasse]);
            setLoading(false);
            setSuccessMsg('Votre demande libre pour la promotion a été transmise avec succès à la scolarité.');
            setMotif('');
            setTimeout(() => setSuccessMsg(''), 5000);
        }, 800);
    };

    return (
        <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif' }}>
            
            {/* Sidebar conforme au design validé */}
            <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', flexShrink: '0' }}>
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <img 
                        src={logoEmit} 
                        alt="EMIT Logo" 
                        style={{ height: '50px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>

                <div style={{ padding: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Principal
                </div>
                <div style={{ padding: '0 12px' }}>
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
                </div>

                <div style={{ padding: '24px 16px 8px 16px', fontSize: '11px', fontWeight: '800', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    Gestion Promotion
                </div>
                <div style={{ padding: '0 12px', display: 'flex', flexDirection: 'column', gap: '4px' }}>
                    <button 
                        onClick={() => setActiveTab('demande-libre')}
                        style={{
                            display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '12px 16px', borderRadius: '10px', border: 'none',
                            background: activeTab === 'demande-libre' ? '#1e3a8a' : 'transparent',
                            color: activeTab === 'demande-libre' ? '#ffffff' : '#475569',
                            fontWeight: '600', fontSize: '14px', cursor: 'pointer', textAlign: 'left', transition: 'all 0.2s'
                        }}
                    >
                        📝 Demande libre
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

            {/* Contenu Principal */}
            <main style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
                <header style={{ padding: '16px 32px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: '20px' }}>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '12px', background: '#f8fafc', padding: '8px 16px', borderRadius: '30px', border: '1px solid #e2e8f0' }}>
                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#1e3a8a', color: '#fff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '12px' }}>
                            {user.nom ? user.nom.substring(0, 2).toUpperCase() : 'DL'}
                        </div>
                        <div>
                            <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: 0 }}>{user.nom || 'Délégué Promotion'}</p>
                            <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Espace Délégué</p>
                        </div>
                    </div>
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

                    {activeTab === 'dashboard' && (
                        <div>
                            <div style={{ background: '#ffffff', padding: '24px', borderRadius: '16px', border: '1px solid #e2e8f0', marginBottom: '24px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                                <h2 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Suivi des demandes de la promotion</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 20px 0' }}>Historique et avancement des requêtes collectives et fiches de notes de la classe.</p>
                                
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
                                                    <span style={{ 
                                                        padding: '6px 12px', borderRadius: '20px', fontSize: '12px', fontWeight: '700',
                                                        background: '#eff6ff', color: '#1e40af'
                                                    }}>
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

                    {activeTab === 'demande-libre' && (
                        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '700px', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>Module Délégué : Demande libre</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>Soumettez une requête officielle groupée au nom de toute votre promotion.</p>

                            <form onSubmit={handleSoumettreDemandeLibre}>
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
                                        Motif détaillé de la demande pour la promotion
                                    </label>
                                    <textarea 
                                        rows="4" 
                                        value={motif} 
                                        onChange={(e) => setMotif(e.target.value)} 
                                        required
                                        placeholder="Expliquez clairement la raison de cette requête collective..."
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
                                    {loading ? 'Transmission...' : 'Soumettre la demande de promotion'}
                                </button>
                            </form>
                        </div>
                    )}

                    {activeTab === 'profil' && (
                        <div style={{ background: '#ffffff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', maxWidth: '600px' }}>
                            <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 16px 0' }}>Profil & Paramètres</h2>
                            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 8px 0' }}><strong>Nom complet :</strong> {user.nom || 'N/A'}</p>
                            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 8px 0' }}><strong>Email :</strong> {user.email || 'N/A'}</p>
                            <p style={{ fontSize: '14px', color: '#334155', margin: '0 0 16px 0' }}><strong>Rôle :</strong> Délégué de promotion</p>
                        </div>
                    )}
                </div>
            </main>
        </div>
    );
}