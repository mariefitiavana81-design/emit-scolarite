import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import logoEmit from '../../assets/emit-logo.png.jpg';

export default function StudentDashboard() {
    const [activeTab, setActiveTab] = useState('tableau-de-bord');
    const [showNotifications, setShowNotifications] = useState(false);

    // États dynamiques reliés à la base de données
    const [nomComplet, setNomComplet] = useState('Chargement...');
    const [email, setEmail] = useState('');
    const [niveau, setNiveau] = useState('');
    const [parcours, setParcours] = useState('');
    const [mention, setMention] = useState('');
    const [ancienMdp, setAncienMdp] = useState('');
    const [nouveauMdp, setNouveauMdp] = useState('');

    const [typeDemande, setTypeDemande] = useState('Certificat de scolarité');
    const [motif, setMotif] = useState('');

    const [notificationsList, setNotificationsList] = useState([]);
    const [mesDemandes, setMesDemandes] = useState([]);

    const navigate = useNavigate();

    // Fonction pour récupérer les vraies informations de l'étudiant connecté depuis la base de données
    const fetchProfileData = async () => {
        try {
            const token = localStorage.getItem('token');
            if (!token) {
                navigate('/login');
                return;
            }

            // Appel de l'API backend connectée à la base de données
            const response = await axios.get('http://localhost:5000/api/etudiant/profil', {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            
            if (response.data) {
                const data = response.data;
                // Mappage des champs exacts de la table PostgreSQL/MySQL (nom, prenom, niveau, parcours, mention, etc.)
                if (data.nomComplet) {
                    setNomComplet(data.nomComplet);
                } else if (data.nom) {
                    const fullName = `${data.nom} ${data.prenom || ''}`.trim();
                    setNomComplet(fullName);
                }
                
                if (data.email) setEmail(data.email);
                if (data.niveau) setNiveau(data.niveau);
                if (data.parcours) setParcours(data.parcours);
                if (data.mention) setMention(data.mention);
                if (data.demandes) setMesDemandes(data.demandes);
                if (data.notifications) setNotificationsList(data.notifications);
            }
        } catch (error) {
            console.error("Erreur lors du chargement des données de la base de données :", error);
            if (error.response && error.response.status === 401) {
                localStorage.removeItem('token');
                navigate('/login');
            }
        }
    };

    useEffect(() => {
        fetchProfileData();
    }, []);

    const handleDeconnexion = () => {
        localStorage.removeItem('token');
        navigate('/login');
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        try {
            const token = localStorage.getItem('token');
            await axios.put('http://localhost:5000/api/etudiant/profil', {
                nomComplet,
                email,
                ancienMdp,
                nouveauMdp
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            alert("Informations mises à jour dans la base de données avec succès !");
            setAncienMdp('');
            setNouveauMdp('');
            fetchProfileData();
        } catch (error) {
            alert("Erreur lors de la mise à jour du profil.");
            console.error(error);
        }
    };

    const handleSoumettreDemande = async (e) => {
        e.preventDefault();
        if (!motif.trim()) {
            alert("Veuillez renseigner un motif pour votre demande.");
            return;
        }
        try {
            const token = localStorage.getItem('token');
            const response = await axios.post('http://localhost:5000/api/etudiant/demandes', {
                type: typeDemande,
                motif: motif
            }, {
                headers: { 'Authorization': `Bearer ${token}` }
            });

            if (response.data) {
                alert("Demande enregistrée dans la base de données avec succès !");
                setMotif('');
                fetchProfileData(); // Actualise la liste depuis la BD
                setActiveTab('mes-demandes');
            }
        } catch (error) {
            console.error("Erreur lors de l'insertion de la demande :", error);
            alert("Erreur lors de la soumission de la demande.");
        }
    };

    // Calculs statistiques basés sur les données réelles de la BD
    const nbEnCours = mesDemandes.filter(d => d.statut && d.statut.toLowerCase().includes('cours')).length;
    const nbValidees = mesDemandes.filter(d => d.statut && (d.statut.toLowerCase().includes('validée') || d.statut.toLowerCase().includes('prête'))).length;
    const totalDemandes = mesDemandes.length;

    // Initiales dynamiques générées à partir du nom récupéré de la base de données
    const initials = (nomComplet && nomComplet !== 'Chargement...') 
        ? nomComplet.split(' ').map(n => n[0]).join('').substring(0, 2).toUpperCase() 
        : 'ET';

    return (
        <div style={{ display: 'flex', height: '100vh', width: '100vw', backgroundColor: '#f1f5f9', fontFamily: 'Inter, sans-serif', overflow: 'hidden' }}>
            
            {/* Sidebar avec fond bleu style binôme (#1e293b) */}
            <div style={{ width: '260px', backgroundColor: '#1e293b', borderRight: '1px solid #334155', display: 'flex', flexDirection: 'column', boxSizing: 'border-box' }}>
                
                {/* Logo Section */}
                <div style={{ padding: '20px 24px', borderBottom: '1px solid #334155', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '112px', boxSizing: 'border-box', backgroundColor: '#ffffff' }}>
                    <img 
                        src={logoEmit} 
                        alt="EMIT Logo" 
                        style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
                    />
                </div>

                {/* Navigation Links */}
                <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '8px', flex: 1 }}>
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', padding: '0 12px 6px', letterSpacing: '0.5px' }}>PRINCIPAL</div>
                    <button 
                        onClick={() => setActiveTab('tableau-de-bord')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'tableau-de-bord' ? '#2563eb' : 'transparent',
                            color: '#ffffff',
                            fontWeight: activeTab === 'tableau-de-bord' ? '600' : '400',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '13px'
                        }}
                    >
                        📊 Tableau de bord
                    </button>
                    
                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', padding: '16px 12px 6px', letterSpacing: '0.5px' }}>SCOLARITÉ</div>
                    <button 
                        onClick={() => setActiveTab('mes-demandes')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'mes-demandes' ? '#2563eb' : 'transparent',
                            color: '#ffffff',
                            fontWeight: activeTab === 'mes-demandes' ? '600' : '400',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            gap: '12px',
                            fontSize: '13px'
                        }}
                    >
                        <span>📂 Mes Demandes</span>
                        <span style={{ background: '#334155', color: '#ffffff', padding: '2px 8px', borderRadius: '12px', fontSize: '11px', fontWeight: '700' }}>
                            {totalDemandes}
                        </span>
                    </button>
                    <button 
                        onClick={() => setActiveTab('nouvelle-demande')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'nouvelle-demande' ? '#2563eb' : 'transparent',
                            color: '#ffffff',
                            fontWeight: activeTab === 'nouvelle-demande' ? '600' : '400',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '13px'
                        }}
                    >
                        ➕ Nouvelle demande
                    </button>

                    <div style={{ fontSize: '11px', fontWeight: '700', color: '#94a3b8', padding: '16px 12px 6px', letterSpacing: '0.5px' }}>COMPTE</div>
                    <button 
                        onClick={() => setActiveTab('parametres')}
                        style={{
                            padding: '12px 16px',
                            borderRadius: '8px',
                            border: 'none',
                            backgroundColor: activeTab === 'parametres' ? '#2563eb' : 'transparent',
                            color: '#ffffff',
                            fontWeight: activeTab === 'parametres' ? '600' : '400',
                            textAlign: 'left',
                            cursor: 'pointer',
                            display: 'flex',
                            alignItems: 'center',
                            gap: '12px',
                            fontSize: '13px'
                        }}
                    >
                        ⚙️ Profil & Paramètres
                    </button>
                </div>
            </div>

            {/* Main Content Area */}
            <div style={{ flex: 1, display: 'flex', flexDirection: 'column', height: '100vh', overflow: 'hidden' }}>
                
                {/* Header conforme au design exigé et positionné exactement comme le modèle délégué */}
                <div style={{ height: '72px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', boxSizing: 'border-box' }}>
                    
                    <div style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
                        
                        {/* Bouton de Notification */}
                        <div style={{ position: 'relative' }}>
                            <button 
                                onClick={() => setShowNotifications(!showNotifications)}
                                style={{ background: '#f1f5f9', border: 'none', borderRadius: '50%', width: '38px', height: '38px', display: 'flex', alignItems: 'center', justifyContent: 'center', cursor: 'pointer', position: 'relative' }}
                            >
                                🔔
                                {notificationsList.length > 0 && (
                                    <span style={{ position: 'absolute', top: '4px', right: '4px', background: '#dc2626', color: '#fff', borderRadius: '50%', width: '8px', height: '8px' }}></span>
                                )}
                            </button>

                            {/* Dropdown Notifications */}
                            {showNotifications && (
                                <div style={{ position: 'absolute', right: 0, top: '45px', width: '300px', background: '#fff', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)', borderRadius: '8px', border: '1px solid #e2e8f0', zIndex: 100, padding: '12px' }}>
                                    <h4 style={{ margin: '0 0 10px 0', fontSize: '14px', color: '#0f172a' }}>Notifications</h4>
                                    {notificationsList.length === 0 ? (
                                        <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Aucune notification</p>
                                    ) : (
                                        notificationsList.map((notif, idx) => (
                                            <div key={idx} style={{ padding: '8px 0', borderBottom: idx < notificationsList.length - 1 ? '1px solid #f1f5f9' : 'none' }}>
                                                <p style={{ fontSize: '12px', color: '#334155', margin: '0 0 4px 0' }}>{notif.message}</p>
                                                <span style={{ fontSize: '10px', color: '#94a3b8' }}>{notif.date}</span>
                                            </div>
                                        ))
                                    )}
                                </div>
                            )}
                        </div>

                        {/* Bloc Profil : Nom dynamique + 'Espace Étudiant' en dessous */}
                        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', border: '1px solid #e2e8f0', padding: '6px 16px 6px 8px', borderRadius: '40px', background: '#f8fafc' }}>
                            <div style={{ width: '36px', height: '36px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '13px' }}>
                                {initials}
                            </div>
                            <div style={{ display: 'flex', flexDirection: 'column' }}>
                                <span style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', letterSpacing: '-0.2px' }}>{nomComplet}</span>
                                <span style={{ fontSize: '11px', color: '#64748b', fontWeight: '500' }}>Espace Étudiant</span>
                            </div>
                        </div>

                        {/* Bouton Actualiser */}
                        <button 
                            onClick={fetchProfileData}
                            style={{ padding: '9px 14px', backgroundColor: '#f1f5f9', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                            title="Actualiser les données"
                        >
                            🔄 Actualiser
                        </button>

                        {/* Bouton Déconnexion */}
                        <button 
                            onClick={handleDeconnexion}
                            style={{ padding: '9px 14px', backgroundColor: '#fee2e2', color: '#dc2626', border: '1px solid #fecaca', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '12px', display: 'flex', alignItems: 'center', gap: '6px' }}
                        >
                            🚪 Déconnexion
                        </button>

                    </div>
                </div>

                {/* Contenu dynamique selon l'onglet actif */}
                <div style={{ flex: 1, padding: '32px', overflowY: 'auto', boxSizing: 'border-box', backgroundColor: '#f1f5f9' }}>
                    
                    {/* TAB: TABLEAU DE BORD */}
                    {activeTab === 'tableau-de-bord' && (
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '24px' }}>
                            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>En cours</span>
                                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#d97706', margin: '4px 0 0 0' }}>{nbEnCours}</h3>
                                    </div>
                                    <div style={{ background: '#fef3c7', padding: '10px', borderRadius: '8px' }}>⏳</div>
                                </div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Prêtes / Validées</span>
                                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#16a34a', margin: '4px 0 0 0' }}>{nbValidees}</h3>
                                    </div>
                                    <div style={{ background: '#dcfce7', padding: '10px', borderRadius: '8px' }}>✅</div>
                                </div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Total demandes</span>
                                        <h3 style={{ fontSize: '24px', fontWeight: '700', color: '#1e3a8a', margin: '4px 0 0 0' }}>{totalDemandes}</h3>
                                    </div>
                                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px' }}>📂</div>
                                </div>
                                <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                                    <div>
                                        <span style={{ fontSize: '13px', color: '#64748b', fontWeight: '500' }}>Parcours &amp; Mention</span>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#1e3a8a', margin: '4px 0 0 0' }}>{niveau} - {parcours} {mention ? `(${mention})` : ''}</h3>
                                    </div>
                                    <div style={{ background: '#eff6ff', padding: '10px', borderRadius: '8px' }}>🎓</div>
                                </div>
                            </div>

                            <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                                <div style={{ background: '#fff', padding: '24px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                                        <h3 style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', margin: 0 }}>Dernières demandes soumises</h3>
                                        <span onClick={() => setActiveTab('mes-demandes')} style={{ fontSize: '13px', color: '#2563eb', cursor: 'pointer', fontWeight: '600' }}>Voir tout →</span>
                                    </div>
                                    <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                                        {mesDemandes.length === 0 ? (
                                            <p style={{ fontSize: '13px', color: '#64748b' }}>Aucune demande enregistrée pour le moment.</p>
                                        ) : (
                                            mesDemandes.slice(0, 3).map((demande, index) => (
                                                <div key={index} style={{ border: '1px solid #f1f5f9', padding: '16px', borderRadius: '8px', background: '#f8fafc' }}>
                                                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '8px' }}>
                                                        <span style={{ fontSize: '11px', padding: '2px 8px', borderRadius: '4px', background: demande.statut && demande.statut.includes('Validée') ? '#dcfce7' : '#fef3c7', color: demande.statut && demande.statut.includes('Validée') ? '#16a34a' : '#d97706', fontWeight: '600' }}>
                                                            {demande.statut}
                                                        </span>
                                                        <span style={{ fontSize: '12px', color: '#94a3b8' }}>{demande.date}</span>
                                                    </div>
                                                    <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>{demande.type}</h4>
                                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Motif : {demande.motif}</p>
                                                </div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                    <div style={{ background: '#fff', padding: '20px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#1e3a8a', marginTop: 0 }}>Retrait des documents</h4>
                                        <p style={{ fontSize: '13px', color: '#64748b', lineHeight: '1.5' }}>Le bureau de la scolarité de l'EMIT est ouvert du lundi au vendredi de 8h00 à 15h00.</p>
                                    </div>
                                    <div style={{ background: '#fef08a', padding: '20px', borderRadius: '12px', border: '1px solid #fde047' }}>
                                        <h4 style={{ fontSize: '15px', fontWeight: '700', color: '#854d0e', marginTop: 0 }}>Délai de traitement</h4>
                                        <p style={{ fontSize: '13px', color: '#713f12', lineHeight: '1.5', margin: 0 }}>Comptez 48h ouvrées pour la validation d'un certificat ou relevé de notes.</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )}

                    {/* TAB: MES DEMANDES */}
                    {activeTab === 'mes-demandes' && (
                        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                                <div>
                                    <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', margin: '0 0 4px 0' }}>Historique de mes demandes</h2>
                                    <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Suivi en temps réel de vos requêtes administratives stockées dans la base de données.</p>
                                </div>
                                <button 
                                    onClick={() => setActiveTab('nouvelle-demande')}
                                    style={{ padding: '10px 18px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', boxShadow: '0 2px 4px rgba(37,99,235,0.2)' }}
                                >
                                    + Nouvelle demande
                                </button>
                            </div>
                            
                            <div style={{ overflowX: 'auto' }}>
                                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left' }}>
                                   <thead>
                                        <tr style={{ borderBottom: '2px solid #f1f5f9', color: '#64748b', fontSize: '12px', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                                            <th style={{ padding: '14px 16px' }}>Type de demande</th>
                                            <th style={{ padding: '14px 16px' }}>Motif</th>
                                            <th style={{ padding: '14px 16px' }}>Date de soumission</th>
                                            <th style={{ padding: '14px 16px' }}>Statut actuel</th>
                                        </tr>
                                   </thead>
                                   <tbody>
                                        {mesDemandes.length === 0 ? (
                                            <tr>
                                                <td colSpan="4" style={{ padding: '24px', textAlign: 'center', color: '#64748b', fontSize: '13px' }}>Aucune demande trouvée dans la base de données.</td>
                                            </tr>
                                        ) : (
                                            mesDemandes.map((d, i) => (
                                                <tr key={i} style={{ borderBottom: '1px solid #f8fafc', fontSize: '13px', transition: 'background 0.2s' }}>
                                                    <td style={{ padding: '16px', fontWeight: '600', color: '#0f172a', display: 'flex', alignItems: 'center', gap: '10px' }}>
                                                        <span style={{ fontSize: '16px' }}>📄</span> {d.type}
                                                    </td>
                                                    <td style={{ padding: '16px', color: '#475569' }}>{d.motif}</td>
                                                    <td style={{ padding: '16px', color: '#64748b' }}>{d.date}</td>
                                                    <td style={{ padding: '16px' }}>
                                                        <span style={{ fontSize: '12px', padding: '6px 12px', borderRadius: '20px', background: d.statut && d.statut.includes('Validée') ? '#dcfce7' : '#fef3c7', color: d.statut && d.statut.includes('Validée') ? '#15803d' : '#b45309', fontWeight: '600', display: 'inline-flex', alignItems: 'center', gap: '6px' }}>
                                                            {d.statut && d.statut.includes('Validée') ? '🟢' : '⏳'} {d.statut}
                                                        </span>
                                                    </td>
                                                </tr>
                                            ))
                                        )}
                                   </tbody>
                                </table>
                            </div>
                        </div>
                    )}

                    {/* TAB: NOUVELLE DEMANDE */}
                    {activeTab === 'nouvelle-demande' && (
                        <div style={{ maxWidth: '700px', margin: '0 auto', background: '#fff', padding: '36px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <div style={{ marginBottom: '24px', textAlign: 'center' }}>
                                <div style={{ fontSize: '32px', marginBottom: '8px' }}>📝</div>
                                <h2 style={{ fontSize: '22px', fontWeight: '700', color: '#0f172a', margin: '0 0 6px 0' }}>Effectuer une nouvelle demande</h2>
                                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Remplissez ce formulaire pour enregistrer votre requête directement dans la base de données.</p>
                            </div>
                            
                            <form onSubmit={handleSoumettreDemande} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Type de document demandé :
                                    </label>
                                    <select 
                                        value={typeDemande} 
                                        onChange={(e) => setTypeDemande(e.target.value)} 
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '14px', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none' }}
                                    >
                                        <option value="Certificat de scolarité">Certificat de scolarité</option>
                                        <option value="Relevé de notes">Relevé de notes officiel</option>
                                        <option value="Attestation de réussite">Attestation de réussite</option>
                                    </select>
                                </div>

                                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Motif de la demande :
                                    </label>
                                    <textarea 
                                        value={motif} 
                                        onChange={(e) => setMotif(e.target.value)} 
                                        placeholder="Ex: Dossier de bourse, inscription concours, dossier bancaire..." 
                                        style={{ width: '100%', padding: '12px 14px', borderRadius: '10px', border: '1px solid #cbd5e1', height: '110px', fontSize: '14px', boxSizing: 'border-box', backgroundColor: '#f8fafc', color: '#0f172a', outline: 'none', resize: 'vertical' }} 
                                    />
                                </div>

                                <div style={{ display: 'flex', gap: '12px', marginTop: '10px' }}>
                                    <button 
                                        type="submit" 
                                        style={{ flex: 1, padding: '14px 16px', backgroundColor: '#2563eb', color: '#ffffff', border: 'none', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px', boxShadow: '0 4px 6px rgba(37,99,235,0.2)' }}
                                    >
                                        🚀 Enregistrer dans la base de données
                                    </button>
                                    <button 
                                        type="button" 
                                        onClick={() => setActiveTab('mes-demandes')}
                                        style={{ padding: '14px 20px', backgroundColor: '#f1f5f9', color: '#475569', border: '1px solid #cbd5e1', borderRadius: '10px', fontWeight: '600', cursor: 'pointer', fontSize: '14px' }}
                                    >
                                        Annuler
                                    </button>
                                </div>
                            </form>
                        </div>
                    )}

                    {/* TAB: PROFIL & PARAMÈTRES */}
                    {activeTab === 'parametres' && (
                        <div style={{ background: '#fff', padding: '32px', borderRadius: '16px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgba(0,0,0,0.05)' }}>
                            <h2 style={{ fontSize: '20px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Profil &amp; Paramètres</h2>
                            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '24px' }}>Gérez vos informations personnelles issues de la base de données</p>
                            
                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '40px', alignItems: 'start' }}>
                                
                                {/* Colonne Gauche : Aperçu profil */}
                                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '30px', border: '1px solid #f1f5f9', borderRadius: '12px', background: '#f8fafc' }}>
                                    <div style={{ position: 'relative', marginBottom: '16px' }}>
                                        <div style={{ width: '80px', height: '80px', borderRadius: '50%', background: '#1e293b', color: '#ffffff', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: '700', fontSize: '24px' }}>
                                            {initials}
                                        </div>
                                        <span style={{ position: 'absolute', bottom: '0', right: '0', width: '14px', height: '14px', background: '#22c55e', border: '2px solid #fff', borderRadius: '50%' }}></span>
                                    </div>
                                    <span style={{ fontSize: '16px', fontWeight: '700', color: '#0f172a', textAlign: 'center' }}>{nomComplet}</span>
                                    <span style={{ fontSize: '12px', color: '#64748b', marginBottom: '16px' }}>{niveau} - {parcours} {mention ? `• ${mention}` : ''}</span>
                                    <div style={{ width: '100%', borderTop: '1px solid #e2e8f0', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '8px' }}>
                                        <span style={{ fontSize: '12px', color: '#475569' }}>✉ {email}</span>
                                        <span style={{ fontSize: '12px', color: '#475569' }}>🎓 Mention : {mention || 'Non spécifiée'}</span>
                                    </div>
                                </div>

                                {/* Colonne Droite : Formulaire Modifier mes Informations */}
                                <form onSubmit={handleUpdateProfile} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
                                    <h3 style={{ fontSize: '15px', fontWeight: '700', color: '#0f172a', marginBottom: '4px' }}>Mettre à jour mes informations</h3>
                                    
                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Nom complet
                                        <input 
                                            type="text" 
                                            value={nomComplet} 
                                            onChange={(e) => setNomComplet(e.target.value)} 
                                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                                        />
                                    </label>

                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Email
                                        <input 
                                            type="email" 
                                            value={email} 
                                            onChange={(e) => setEmail(e.target.value)} 
                                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                                        />
                                    </label>

                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Mot de passe actuel
                                        <input 
                                            type="password" 
                                            placeholder="Requis pour changer le mot de passe" 
                                            value={ancienMdp} 
                                            onChange={(e) => setAncienMdp(e.target.value)} 
                                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                                        />
                                    </label>

                                    <label style={{ fontSize: '13px', fontWeight: '600', color: '#334155' }}>
                                        Nouveau mot de passe (min. 8 caractères)
                                        <input 
                                            type="password" 
                                            placeholder="••••••••" 
                                            value={nouveauMdp} 
                                            onChange={(e) => setNouveauMdp(e.target.value)} 
                                            style={{ width: '100%', padding: '10px', marginTop: '6px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                                        />
                                    </label>

                                    <div style={{ display: 'flex', gap: '12px', marginTop: '12px' }}>
                                        <button type="submit" style={{ padding: '10px 20px', backgroundColor: '#1e293b', color: '#ffffff', border: 'none', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            💾 Enregistrer dans la BD
                                        </button>
                                        <button type="button" onClick={handleDeconnexion} style={{ padding: '10px 20px', backgroundColor: '#ffffff', color: '#1e293b', border: '1px solid #cbd5e1', borderRadius: '8px', fontWeight: '600', cursor: 'pointer', fontSize: '13px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                                            🚪 Déconnexion
                                        </button>
                                    </div>
                                </form>

                            </div>
                        </div>
                    )}
                </div>

            </div>
        </div>
    );
}