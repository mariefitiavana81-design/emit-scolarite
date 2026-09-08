import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logoEmit from '../../assets/emit-logo.png.jpg';

export default function StudentDashboard() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('dashboard');
  const [filterStatus, setFilterStatus] = useState('TOUS');
  const [selectedTypeDemande, setSelectedTypeDemande] = useState('certificat');
  const [motif, setMotif] = useState('');
  const [nombreExemplaires, setNombreExemplaires] = useState(1);
  const [anneeAcademique, setAnneeAcademique] = useState('2025-2026');
  const [semestre, setSemestre] = useState('Semestre 1');
  const [pieceJustificative, setPieceJustificative] = useState(null);
  const [notificationMessage, setNotificationMessage] = useState(null);

  const [studentData, setStudentData] = useState({
    nom: 'Rakotomalala',
    prenom: 'Andry Faniry',
    email: 'andry.rakotomalala@emit.mg',
    matricule: 'ET-2023-0892',
    telephone: '+261 34 12 345 67',
    cin: '101 234 567 890',
    dateNaissance: '2003-05-14',
    lieuNaissance: 'Fianarantsoa',
    adresse: 'Lot IVB Ambatomena, Fianarantsoa',
    sexe: 'Masculin',
    nomPere: 'Rakotomalala Jean',
    nomMere: 'Rasoanantenaina Marie',
    serieBac: 'D',
    anneeBac: '2022',
    niveau: 'L3',
    libelleNiveau: 'Licence 3ème Année',
    parcours: 'GB',
    libelleParcours: 'Génie Logiciel et Base de Données',
    mention: 'Informatique',
    anneeAcademique: '2025-2026'
  });

  const [demandes, setDemandes] = useState([
    {
      id: 1,
      type: 'Certificat de scolarité',
      dateSoumission: '2026-09-04',
      statut: 'En cours de traitement',
      codeStatut: 'en_cours',
      annee: '2025-2026',
      motif: 'Dossier de bourse',
      exemplaires: 1,
      commentaires: 'Pris en charge par l’agent de scolarité.'
    },
    {
      id: 2,
      type: 'Relevé de notes',
      dateSoumission: '2026-08-20',
      statut: 'Validée / Prête',
      codeStatut: 'prete',
      annee: '2024-2025',
      motif: 'Inscription concours',
      exemplaires: 2,
      commentaires: 'Document généré et signé numériquement.',
      lienFichier: '#'
    },
    {
      id: 3,
      type: 'Absence avec pièce justificative',
      dateSoumission: '2026-08-10',
      statut: 'Clôturée',
      codeStatut: 'cloturee',
      annee: '2025-2026',
      motif: 'Certificat médical du 08/08 au 09/08',
      exemplaires: 1,
      commentaires: 'Justifié et accepté par la scolarité.'
    }
  ]);

  const [notifications, setNotifications] = useState([
    { id: 1, message: 'Votre demande de certificat de scolarité est passée au statut : En cours de traitement.', date: '2026-09-04', lue: false },
    { id: 2, message: 'Votre relevé de notes est prêt à être téléchargé.', date: '2026-08-21', lue: true }
  ]);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const handleNouvelleDemandeSubmit = (e) => {
    e.preventDefault();
    const nouvelle = {
      id: demandes.length + 1,
      type: selectedTypeDemande === 'certificat' ? 'Certificat de scolarité' :
            selectedTypeDemande === 'releve' ? `Relevé de notes (${semestre})` :
            selectedTypeDemande === 'attestation' ? 'Attestation de réussite' :
            selectedTypeDemande === 'absence' ? 'Absence avec pièce justificative' : 'Demande de diplôme',
      dateSoumission: new Date().toISOString().split('T')[0],
      statut: 'Soumise',
      codeStatut: 'soumise',
      annee: anneeAcademique,
      motif: motif || 'Aucun motif particulier',
      exemplaires: nombreExemplaires,
      commentaires: 'Demande enregistrée avec succès dans le système.'
    };

    setDemandes([nouvelle, ...demandes]);
    setNotifications([
      { id: notifications.length + 1, message: `Votre demande de "${nouvelle.type}" a bien été soumise.`, date: nouvelle.dateSoumission, lue: false },
      ...notifications
    ]);
    setNotificationMessage('Demande soumise avec succès ! Retrouvez-la dans "Mes Demandes".');
    setMotif('');
    setTimeout(() => setNotificationMessage(null), 5000);
    setActiveTab('demandes');
  };

  const filteredDemandes = demandes.filter(d => {
    if (filterStatus === 'TOUS') return true;
    return d.codeStatut === filterStatus;
  });

  return (
    <div style={{ display: 'flex', height: '100vh', background: '#f8fafc', fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif', overflow: 'hidden' }}>
      {/* Sidebar Navigation - Largeur fixée à 260px */}
      <aside style={{ width: '260px', background: '#ffffff', borderRight: '1px solid #e2e8f0', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', userSelect: 'none', flexShrink: 0 }}>
        <div>
          {/* Logo Section */}
          <div style={{ padding: '20px 24px', borderBottom: '1px solid #f1f5f9', display: 'flex', alignItems: 'center', justifyContent: 'center', height: '112px', boxSizing: 'border-box' }}>
            <img 
              src={logoEmit} 
              alt="EMIT Logo" 
              style={{ height: '72px', width: 'auto', objectFit: 'contain' }}
            />
          </div>

          <div style={{ padding: '20px 16px', display: 'flex', flexDirection: 'column', gap: '20px', fontSize: '12px' }}>
            <div>
              <p style={{ padding: '0 12px 8px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', fontSize: '10px', margin: 0 }}>PRINCIPAL</p>
              <button 
                onClick={() => setActiveTab('dashboard')}
                style={{ 
                  display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'dashboard' ? '#1e3a8a' : 'transparent',
                  color: activeTab === 'dashboard' ? '#ffffff' : '#475569',
                  boxShadow: activeTab === 'dashboard' ? '0 4px 12px rgba(30, 58, 138, 0.2)' : 'none'
                }}
              >
                <span style={{ fontSize: '15px' }}>📅</span> Tableau de bord
              </button>
            </div>

            <div>
              <p style={{ padding: '0 12px 8px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', fontSize: '10px', margin: 0 }}>SCOLARITÉ EMIT</p>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                <button 
                  onClick={() => setActiveTab('demandes')}
                  style={{ 
                    display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                    background: activeTab === 'demandes' ? '#1e3a8a' : 'transparent',
                    color: activeTab === 'demandes' ? '#ffffff' : '#475569'
                  }}
                >
                  <span style={{ fontSize: '15px' }}>📝</span> Mes Demandes ({demandes.length})
                </button>
                <button 
                  onClick={() => setActiveTab('nouvelle')}
                  style={{ 
                    display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                    background: activeTab === 'nouvelle' ? '#1e3a8a' : 'transparent',
                    color: activeTab === 'nouvelle' ? '#ffffff' : '#475569'
                  }}
                >
                  <span style={{ fontSize: '15px' }}>➕</span> Nouvelle demande
                </button>
              </div>
            </div>

            <div>
              <p style={{ padding: '0 12px 8px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', fontSize: '10px', margin: 0 }}>COMMUNICATION</p>
              <button 
                onClick={() => setActiveTab('notifications')}
                style={{ 
                  display: 'flex', alignItems: 'center', justifyContent: 'space-between', width: '100%', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'notifications' ? '#1e3a8a' : 'transparent',
                  color: activeTab === 'notifications' ? '#ffffff' : '#475569'
                }}
              >
                <span style={{ display: 'flex', alignItems: 'center', gap: '12px' }}><span style={{ fontSize: '15px' }}>🔔</span> Notifications</span>
                <span style={{ background: '#ef4444', color: '#fff', padding: '2px 6px', borderRadius: '10px', fontSize: '10px' }}>{notifications.filter(n => !n.lue).length}</span>
              </button>
            </div>

            <div>
              <p style={{ padding: '0 12px 8px', fontWeight: '800', color: '#94a3b8', letterSpacing: '0.05em', fontSize: '10px', margin: 0 }}>COMPTE</p>
              <button 
                onClick={() => setActiveTab('profil')}
                style={{ 
                  display: 'flex', alignItems: 'center', width: '100%', gap: '12px', padding: '10px 12px', borderRadius: '8px', fontWeight: '600', fontSize: '13px', border: 'none', cursor: 'pointer',
                  background: activeTab === 'profil' ? '#1e3a8a' : 'transparent',
                  color: activeTab === 'profil' ? '#ffffff' : '#475569'
                }}
              >
                <span style={{ fontSize: '15px' }}>⚙️</span> Profil & Informations
              </button>
            </div>
          </div>
        </div>

        <div style={{ padding: '16px', borderTop: '1px solid #f1f5f9', fontSize: '11px', color: '#64748b', textAlign: 'center' }}>
          EMIT Fianarantsoa v1.0
        </div>
      </aside>

      {/* Main Content Area */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflowY: 'auto' }}>
        {/* Header */}
        <header style={{ height: '112px', background: '#ffffff', borderBottom: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'flex-end', padding: '0 32px', boxSizing: 'border-box' }}>
          
          {/* Bloc Droit du Header : Cadre avec Nom, Matricule et Filière, suivi du bouton Déconnexion */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '20px' }}>
            <div style={{ width: '260px', height: '72px', display: 'flex', alignItems: 'center', padding: '0 12px', background: '#f8fafc', border: '1px solid #e2e8f0', borderRadius: '10px', boxSizing: 'border-box' }}>
              <div style={{ lineHeight: '1.3', width: '100%' }}>
                <p style={{ fontSize: '13px', fontWeight: '700', color: '#0f172a', margin: '0 0 2px 0' }}>{studentData.prenom} {studentData.nom}</p>
                <p style={{ fontSize: '11px', color: '#64748b', margin: '0 0 2px 0' }}>Matricule : <strong>{studentData.matricule}</strong></p>
                <p style={{ fontSize: '11px', fontWeight: '800', color: '#1e3a8a', margin: 0 }}>{studentData.libelleParcours} ({studentData.niveau})</p>
              </div>
            </div>

            <div style={{ height: '24px', width: '1px', background: '#e2e8f0' }}></div>

            <button 
              onClick={handleLogout}
              style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '12px', fontWeight: '600', color: '#475569', background: '#ffffff', border: '1px solid #e2e8f0', padding: '8px 14px', borderRadius: '8px', cursor: 'pointer', transition: 'all 0.2s' }}
              onMouseOver={(e) => { e.currentTarget.style.color = '#dc2626'; e.currentTarget.style.borderColor = '#fca5a5'; e.currentTarget.style.background = '#fef2f2'; }}
              onMouseOut={(e) => { e.currentTarget.style.color = '#475569'; e.currentTarget.style.borderColor = '#e2e8f0'; e.currentTarget.style.background = '#ffffff'; }}
            >
              ↪ Déconnexion
            </button>
          </div>
        </header>

        {/* Feedback Alert Toast */}
        {notificationMessage && (
          <div style={{ margin: '20px 32px 0', padding: '12px 16px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '10px', fontSize: '13px', fontWeight: '600' }}>
            {notificationMessage}
          </div>
        )}

        {/* Dynamic Body Content per Tab */}
        <main style={{ padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
          
          {/* TAB 1: DASHBOARD */}
          {activeTab === 'dashboard' && (
            <>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0', letterSpacing: '-0.02em' }}>Tableau de bord de la Scolarité</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Bienvenue sur votre espace officiel EMIT - Année académique {studentData.anneeAcademique}</p>
                </div>
                <button 
                  onClick={() => setActiveTab('nouvelle')}
                  style={{ display: 'flex', alignItems: 'center', gap: '8px', background: '#1e3a8a', color: '#ffffff', padding: '12px 20px', borderRadius: '10px', fontSize: '12px', fontWeight: '700', border: 'none', cursor: 'pointer', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' }}
                >
                  + Nouvelle demande
                </button>
              </div>

              {/* Stat Cards */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '16px' }}>
                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', margin: '0 0 6px 0' }}>En cours</p>
                    <p style={{ fontSize: '24px', fontWeight: '900', color: '#d97706', margin: 0 }}>{demandes.filter(d => d.codeStatut === 'en_cours' || d.codeStatut === 'soumise').length}</p>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#fef3c7', color: '#d97706', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>⏳</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', margin: '0 0 6px 0' }}>Prêtes / Validées</p>
                    <p style={{ fontSize: '24px', fontWeight: '900', color: '#059669', margin: 0 }}>{demandes.filter(d => d.codeStatut === 'prete').length}</p>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#ecfdf5', color: '#059669', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>✅</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', margin: '0 0 6px 0' }}>Total demandes</p>
                    <p style={{ fontSize: '24px', fontWeight: '900', color: '#1e3a8a', margin: 0 }}>{demandes.length}</p>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#eff6ff', color: '#1e3a8a', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>📁</div>
                </div>

                <div style={{ background: '#ffffff', padding: '20px', borderRadius: '16px', border: '1px solid #e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div>
                    <p style={{ fontSize: '12px', fontWeight: '500', color: '#64748b', margin: '0 0 6px 0' }}>Niveau Actuel</p>
                    <p style={{ fontSize: '18px', fontWeight: '900', color: '#4f46e5', margin: 0 }}>{studentData.niveau} - {studentData.parcours}</p>
                  </div>
                  <div style={{ width: '40px', height: '40px', borderRadius: '10px', background: '#e0e7ff', color: '#4f46e5', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '18px' }}>🎓</div>
                </div>
              </div>

              {/* Grid: Recent requests and quick actions */}
              <div style={{ display: 'grid', gridTemplateColumns: '2fr 1fr', gap: '24px' }}>
                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Dernières demandes soumises</h2>
                    <button onClick={() => setActiveTab('demandes')} style={{ background: 'transparent', border: 'none', color: '#1e3a8a', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}>Voir tout →</button>
                  </div>

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    {demandes.slice(0, 3).map((d) => (
                      <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '14px', borderRadius: '10px', background: '#f8fafc', border: '1px solid #f1f5f9' }}>
                        <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
                          <span style={{ 
                            display: 'inline-block', padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700', width: 'fit-content',
                            background: d.codeStatut === 'prete' ? '#d1fae5' : d.codeStatut === 'en_cours' ? '#fef3c7' : '#e0f2fe',
                            color: d.codeStatut === 'prete' ? '#065f46' : d.codeStatut === 'en_cours' ? '#b45309' : '#0369a1'
                          }}>
                            {d.statut}
                          </span>
                          <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{d.type}</p>
                          <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>Motif : {d.motif}</p>
                        </div>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>{d.dateSoumission}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                  <h2 style={{ fontSize: '14px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Informations Scolarité</h2>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                    <div style={{ padding: '12px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #dbeafe' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 4px 0' }}>Retrait des cartes</p>
                      <p style={{ fontSize: '11px', color: '#334155', margin: 0 }}>Le bureau de la scolarité est ouvert du lundi au vendredi de 8h00 à 15h00.</p>
                    </div>
                    <div style={{ padding: '12px', borderRadius: '10px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                      <p style={{ fontSize: '11px', fontWeight: '700', color: '#b45309', margin: '0 0 4px 0' }}>Délai de traitement</p>
                      <p style={{ fontSize: '11px', color: '#334155', margin: 0 }}>Comptez 48h ouvrées pour la validation d'un certificat ou relevé de notes.</p>
                    </div>
                  </div>
                </div>
              </div>
            </>
          )}

          {/* TAB 2: MES DEMANDES */}
          {activeTab === 'demandes' && (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                <div>
                  <h1 style={{ fontSize: '22px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>Gestion de vos Demandes</h1>
                  <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Suivi détaillé et historique de l'ensemble de vos requêtes</p>
                </div>
                <div style={{ display: 'flex', gap: '8px' }}>
                  {['TOUS', 'soumise', 'en_cours', 'prete', 'cloturee'].map((st) => (
                    <button
                      key={st}
                      onClick={() => setFilterStatus(st)}
                      style={{
                        padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', border: '1px solid #e2e8f0', cursor: 'pointer',
                        background: filterStatus === st ? '#1e3a8a' : '#ffffff',
                        color: filterStatus === st ? '#ffffff' : '#475569'
                      }}
                    >
                      {st === 'TOUS' ? 'Tous' : st.replace('_', ' ').toUpperCase()}
                    </button>
                  ))}
                </div>
              </div>

              <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
                {filteredDemandes.length === 0 ? (
                  <p style={{ textAlign: 'center', color: '#94a3b8', padding: '40px', fontSize: '13px' }}>Aucune demande trouvée pour ce filtre.</p>
                ) : (
                  filteredDemandes.map((d) => (
                    <div key={d.id} style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '16px', borderRadius: '12px', background: '#f8fafc', border: '1px solid #e2e8f0' }}>
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
                        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                          <span style={{ 
                            padding: '2px 8px', borderRadius: '6px', fontSize: '10px', fontWeight: '700',
                            background: d.codeStatut === 'prete' ? '#d1fae5' : d.codeStatut === 'en_cours' ? '#fef3c7' : '#e0f2fe',
                            color: d.codeStatut === 'prete' ? '#065f46' : d.codeStatut === 'en_cours' ? '#b45309' : '#0369a1'
                          }}>
                            {d.statut}
                          </span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Année : {d.annee}</span>
                          <span style={{ fontSize: '11px', color: '#64748b' }}>Exemplaires : {d.exemplaires}</span>
                        </div>
                        <h3 style={{ fontSize: '14px', fontWeight: '800', color: '#1e293b', margin: 0 }}>{d.type}</h3>
                        <p style={{ fontSize: '12px', color: '#475569', margin: 0 }}>Motif : {d.motif}</p>
                        <p style={{ fontSize: '11px', color: '#059669', margin: 0, fontStyle: 'italic' }}>Note de la scolarité : {d.commentaires}</p>
                      </div>

                      <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '8px' }}>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Soumis le {d.dateSoumission}</span>
                        {d.codeStatut === 'prete' && (
                          <button 
                            onClick={() => alert('Téléchargement du document officiel signé en cours...')}
                            style={{ background: '#059669', color: '#ffffff', border: 'none', padding: '6px 12px', borderRadius: '8px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                          >
                            📥 Télécharger le document
                          </button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 3: NOUVELLE DEMANDE */}
          {activeTab === 'nouvelle' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', maxWidth: '700px', margin: '0 auto', width: '100%' }}>
              <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 6px 0' }}>Soumettre une nouvelle demande</h1>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>Sélectionnez le type de document ou de démarche auprès de la scolarité de l'EMIT.</p>

              <form onSubmit={handleNouvelleDemandeSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '20px' }}>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Type de demande *</label>
                  <select 
                    value={selectedTypeDemande}
                    onChange={(e) => setSelectedTypeDemande(e.target.value)}
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                  >
                    <option value="certificat">Certificat de scolarité</option>
                    <option value="releve">Relevé de notes</option>
                    <option value="attestation">Attestation de réussite / fin d'études</option>
                    <option value="absence">Absence avec pièce justificative</option>
                    <option value="diplome">Demande de diplôme</option>
                  </select>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px' }}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Année académique *</label>
                    <select 
                      value={anneeAcademique}
                      onChange={(e) => setAnneeAcademique(e.target.value)}
                      style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                    >
                      <option value="2025-2026">2025-2026</option>
                      <option value="2024-2025">2024-2025</option>
                      <option value="2023-2024">2023-2024</option>
                    </select>
                  </div>

                  {selectedTypeDemande === 'releve' && (
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Semestre / Niveau *</label>
                      <select 
                        value={semestre}
                        onChange={(e) => setSemestre(e.target.value)}
                        style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                      >
                        <option value="Semestre 1">Semestre 1</option>
                        <option value="Semestre 2">Semestre 2</option>
                        <option value="Année complète">Année complète</option>
                      </select>
                    </div>
                  )}

                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Nombre d'exemplaires</label>
                    <input 
                      type="number" 
                      min="1" 
                      max="5" 
                      value={nombreExemplaires}
                      onChange={(e) => setNombreExemplaires(parseInt(e.target.value) || 1)}
                      style={{ padding: '11px 12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px' }}
                    />
                  </div>
                </div>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                  <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Motif de la demande / Usage prévu (Optionnel)</label>
                  <textarea 
                    rows="3"
                    value={motif}
                    onChange={(e) => setMotif(e.target.value)}
                    placeholder="Ex: Dossier de bourse, demande de stage, visa..."
                    style={{ padding: '12px', borderRadius: '10px', border: '1px solid #cbd5e1', fontSize: '13px', fontFamily: 'inherit' }}
                  ></textarea>
                </div>

                {selectedTypeDemande === 'absence' && (
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', padding: '16px', background: '#f8fafc', borderRadius: '10px', border: '1px dashed #cbd5e1' }}>
                    <label style={{ fontSize: '12px', fontWeight: '700', color: '#334155' }}>Pièce justificative (Certificat médical / Convocation) *</label>
                    <input 
                      type="file" 
                      accept=".pdf,.png,.jpg,.jpeg"
                      onChange={(e) => setPieceJustificative(e.target.files[0])}
                      style={{ fontSize: '12px' }}
                    />
                    <span style={{ fontSize: '11px', color: '#64748b' }}>Formats acceptés : PDF, JPG, PNG (Max 5Mo)</span>
                  </div>
                )}

                <button 
                  type="submit"
                  style={{ background: '#1e3a8a', color: '#ffffff', border: 'none', padding: '14px', borderRadius: '10px', fontSize: '13px', fontWeight: '700', cursor: 'pointer', marginTop: '10px', boxShadow: '0 4px 12px rgba(30, 58, 138, 0.2)' }}
                >
                  Valider et soumettre la demande
                </button>
              </form>
            </div>
          )}

          {/* TAB 4: NOTIFICATIONS */}
          {activeTab === 'notifications' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '24px', display: 'flex', flexDirection: 'column', gap: '16px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: 0 }}>Centre de Notifications</h1>
                <button 
                  onClick={() => setNotifications(notifications.map(n => ({ ...n, lue: true })))}
                  style={{ background: '#f1f5f9', border: 'none', padding: '8px 12px', borderRadius: '8px', fontSize: '12px', fontWeight: '600', color: '#475569', cursor: 'pointer' }}
                >
                  Tout marquer comme lu
                </button>
              </div>

              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {notifications.map((n) => (
                  <div key={n.id} style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', padding: '14px', borderRadius: '10px', background: n.lue ? '#ffffff' : '#f0fdf4', border: '1px solid #e2e8f0' }}>
                    <div style={{ display: 'flex', gap: '12px', alignItems: 'flex-start' }}>
                      <span style={{ fontSize: '16px' }}>{n.lue ? '📌' : '🔔'}</span>
                      <div>
                        <p style={{ fontSize: '13px', fontWeight: n.lue ? '500' : '700', color: '#1e293b', margin: '0 0 4px 0' }}>{n.message}</p>
                        <span style={{ fontSize: '11px', color: '#94a3b8' }}>Reçu le {n.date}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: PROFIL ET INFORMATIONS */}
          {activeTab === 'profil' && (
            <div style={{ background: '#ffffff', borderRadius: '16px', border: '1px solid #e2e8f0', padding: '32px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
              <div>
                <h1 style={{ fontSize: '20px', fontWeight: '900', color: '#0f172a', margin: '0 0 4px 0' }}>Profil Académique et Personnel</h1>
                <p style={{ fontSize: '13px', color: '#64748b', margin: 0 }}>Informations enregistrées dans la base de données de l'EMIT</p>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '20px' }}>
                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Nom & Prénom</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.nom} {studentData.prenom}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Numéro Matricule</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e3a8a', margin: 0 }}>{studentData.matricule}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Mention & Parcours</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.mention} - {studentData.libelleParcours}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Niveau d'études</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.libelleNiveau} ({studentData.niveau})</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Numéro CIN</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.cin}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Date et Lieu de naissance</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.dateNaissance} à {studentData.lieuNaissance}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Filiation (Père & Mère)</p>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Père : {studentData.nomPere}</p>
                  <p style={{ fontSize: '13px', fontWeight: '700', color: '#1e293b', margin: '2px 0 0 0' }}>Mère : {studentData.nomMere}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Informations du Baccalauréat</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>Série {studentData.serieBac}, Session {studentData.anneeBac}</p>
                </div>

                <div style={{ padding: '16px', background: '#f8fafc', borderRadius: '12px', border: '1px solid #f1f5f9' }}>
                  <p style={{ fontSize: '11px', fontWeight: '700', color: '#64748b', margin: '0 0 4px 0' }}>Adresse actuelle</p>
                  <p style={{ fontSize: '14px', fontWeight: '700', color: '#1e293b', margin: 0 }}>{studentData.adresse}</p>
                </div>
              </div>
            </div>
          )}

        </main>
      </div>
    </div>
  );
}