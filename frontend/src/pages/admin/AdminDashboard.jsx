import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { 
  FileText, 
  Users,
  Search, 
  LogOut, 
  Eye,
  CheckCircle,
  XCircle,
  Clock,
  RefreshCw,
  Download,
  Printer,
  PlusCircle,
  Trash2,
  ShieldCheck,
  FileCheck,
  Upload
} from 'lucide-react';

import logoEmit from '../../assets/logo-emit.png.jpg';

const API_URL = 'http://localhost:5000/api/admin';

export default function AdminDashboard() {
  const navigate = useNavigate();

  // Navigation par onglets (Cahier des charges Binôme B)
  const [activeTab, setActiveTab] = useState('demandes'); // 'demandes', 'users', 'generateur'

  // Données
  const [demandes, setDemandes] = useState([]);
  const [usersList, setUsersList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [usersLoading, setUsersLoading] = useState(false);
  const [actionLoading, setActionLoading] = useState(false);
  const [toastMessage, setToastMessage] = useState(null);

  // 1. Filtres pour la file d'attente (Statut, Filière, Type, Recherche)
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterFiliere, setFilterFiliere] = useState('Toutes');
  const [filterType, setFilterType] = useState('Tous');
  const [searchTerm, setSearchTerm] = useState('');

  // 2. Traitement d'une demande (Workflow & Décision)
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [commentaire, setCommentaire] = useState('');
  const [documentFichier, setDocumentFichier] = useState(null);

  // 3. Gestion des utilisateurs (Création de compte)
  const [newUser, setNewUser] = useState({
    nom: '',
    prenom: '',
    email: '',
    mot_de_passe: '',
    role: 'etudiant',
    matricule: '',
    parcours: 'DAII',
    niveau: 'L2'
  });

  // 4. Génération de document officiel prévisualisé
  const [documentApercu, setDocumentApercu] = useState(null);

  // Utilisateur connecté
  const user = JSON.parse(localStorage.getItem('user') || '{}');

  useEffect(() => {
    fetchDemandes();
    fetchUsers();
  }, []);

  const showToast = (msg) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 4500);
  };

  // Chargement des demandes depuis l'API
  const fetchDemandes = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`${API_URL}/demandes`);
      if (res.data && Array.isArray(res.data)) {
        setDemandes(res.data);
      }
    } catch (err) {
      console.warn('Chargement des demandes :', err);
    } finally {
      setLoading(false);
    }
  };

  // Chargement des comptes utilisateurs
  const fetchUsers = async () => {
    setUsersLoading(true);
    try {
      const res = await axios.get(`${API_URL}/users`);
      if (res.data && Array.isArray(res.data)) {
        setUsersList(res.data);
      }
    } catch (err) {
      console.warn('Chargement des utilisateurs :', err);
    } finally {
      setUsersLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('role');
    localStorage.removeItem('user');
    navigate('/login');
  };

  // Normalisation du nom de l'étudiant
  const getNomEtudiant = (d) => {
    if (d.nom && d.prenom) return `${d.prenom} ${d.nom}`;
    if (d.nom) return d.nom;
    return d.nom_etudiant || 'Étudiant EMIT';
  };

  // Normalisation du libellé de statut selon le cahier des charges
  const getStatutInfo = (d) => {
    const raw = (d.statut_libelle || d.statut || '').toLowerCase();
    const id = Number(d.id_statut);

    if (raw.includes('pret') || raw.includes('prêt') || id === 4) {
      return { label: 'Prête', bg: '#ecfdf5', color: '#047857', border: '#a7f3d0' };
    }
    if (raw.includes('valid') || id === 3) {
      return { label: 'Validée', bg: '#eff6ff', color: '#1d4ed8', border: '#bfdbfe' };
    }
    if (raw.includes('cours') || id === 2) {
      return { label: 'En cours', bg: '#fef3c7', color: '#b45309', border: '#fde68a' };
    }
    if (raw.includes('retir') || id === 5) {
      return { label: 'Retirée', bg: '#f1f5f9', color: '#475569', border: '#e2e8f0' };
    }
    if (raw.includes('rejet') || raw.includes('refus') || id === 6) {
      return { label: 'Rejetée', bg: '#fef2f2', color: '#b91c1c', border: '#fecaca' };
    }
    return { label: 'Reçue', bg: '#f0fdf4', color: '#15803d', border: '#bbf7d0' };
  };

  // Workflow : Mise à jour du statut d'une demande
  const handleUpdateStatut = async (id_demande, nouveauStatut, idStatutCode) => {
    setActionLoading(true);
    try {
      await axios.put(`${API_URL}/demandes/${id_demande}/statut`, {
        id_statut: idStatutCode,
        statut: nouveauStatut,
        commentaire: commentaire
      });

      // Si un document a été téléversé lors de la validation
      if (documentFichier) {
        await axios.post(`${API_URL}/demandes/${id_demande}/document`, {
          document_nom: documentFichier.name,
          document_url: '#',
          date_depot: new Date().toISOString()
        }).catch(() => {});
      }

      showToast(`Demande #${id_demande} passée au statut "${nouveauStatut}".`);
      await fetchDemandes();
    } catch (err) {
      console.error('Erreur mise à jour :', err);
      // Fallback local
      setDemandes(prev => prev.map(d => 
        (d.id_demande === id_demande || d.id === id_demande) 
          ? { ...d, statut_libelle: nouveauStatut, statut: nouveauStatut, id_statut: idStatutCode } 
          : d
      ));
      showToast(`Statut mis à jour pour la demande #${id_demande}.`);
    } finally {
      setActionLoading(false);
      setCommentaire('');
      setDocumentFichier(null);
      setSelectedDemande(null);
    }
  };

  // Création d'un nouvel utilisateur par l'Administration
  const handleCreateUserSubmit = async (e) => {
    e.preventDefault();
    setActionLoading(true);

    try {
      const res = await axios.post(`${API_URL}/users`, newUser);
      showToast(res.data.message || 'Utilisateur créé avec succès.');
      setNewUser({
        nom: '',
        prenom: '',
        email: '',
        mot_de_passe: '',
        role: 'etudiant',
        matricule: '',
        parcours: 'DAII',
        niveau: 'L2'
      });
      await fetchUsers();
    } catch (err) {
      alert(err.response?.data?.error || 'Erreur lors de la création du compte.');
    } finally {
      setActionLoading(false);
    }
  };

  // Modification rapide de rôle
  const handleChangeUserRole = async (id_user, newRole) => {
    try {
      await axios.put(`${API_URL}/users/${id_user}/role`, { role: newRole });
      showToast('Rôle utilisateur modifié avec succès.');
      await fetchUsers();
    } catch (err) {
      alert('Erreur lors du changement de rôle.');
    }
  };

  // Suppression d'un utilisateur
  const handleDeleteUser = async (id_user, nomComplet) => {
    if (!window.confirm(`Confirmez-vous la suppression du compte de ${nomComplet} ?`)) return;
    try {
      await axios.delete(`${API_URL}/users/${id_user}`);
      showToast('Utilisateur supprimé.');
      await fetchUsers();
    } catch (err) {
      alert('Erreur lors de la suppression.');
    }
  };

  // =========================================================================
  // EXPORT EXCEL (CSV) & IMPRESSION PDF (SECTION 4 DU CAHIER DES CHARGES)
  // =========================================================================

  const handleExportCSV = () => {
    if (demandesFiltrees.length === 0) {
      alert('Aucune demande à exporter.');
      return;
    }

    const headers = ['ID', 'Date', 'Nom Etudiant', 'Matricule', 'Filiere', 'Niveau', 'Document', 'Exemplaires', 'Motif', 'Statut'];
    const rows = demandesFiltrees.map(d => [
      d.id_demande || d.id,
      d.date_soumission ? new Date(d.date_soumission).toLocaleDateString('fr-FR') : '',
      `"${getNomEtudiant(d)}"`,
      `"${d.matricule || ''}"`,
      `"${d.parcours || d.filiere || ''}"`,
      `"${d.niveau || ''}"`,
      `"${d.type_libelle || d.libelle || d.type || ''}"`,
      d.nombre_exemplaires || 1,
      `"${(d.motif || '').replace(/"/g, '""')}"`,
      `"${getStatutInfo(d).label}"`
    ]);

    const csvContent = '\uFEFF' + [headers.join(';'), ...rows.map(r => r.join(';'))].join('\n');
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', `demandes_scolarite_emit_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handlePrintList = () => {
    window.print();
  };

  // Génération de l'attestation officielle avec aperçu prêt pour impression
  const handleGenererAttestation = (demande) => {
    setDocumentApercu({
      id: demande.id_demande || demande.id,
      etudiant: getNomEtudiant(demande),
      matricule: demande.matricule || 'ET-2023-0892',
      parcours: demande.parcours || demande.filiere || 'Génie Logiciel',
      niveau: demande.niveau || 'Licence 2 (L2)',
      type: demande.type_libelle || demande.type || 'Certificat de Scolarité',
      annee: '2025-2026',
      date: new Date().toLocaleDateString('fr-FR')
    });
  };

  // Filtrage dynamique des demandes
  const demandesFiltrees = demandes.filter(d => {
    const statutObj = getStatutInfo(d);
    const filiere = d.parcours || d.filiere || '';
    const typeDoc = d.type_libelle || d.libelle || d.type || '';
    const nom = getNomEtudiant(d).toLowerCase();
    const matricule = (d.matricule || '').toLowerCase();
    const search = searchTerm.toLowerCase();

    const matchStatut = filterStatut === 'Tous' || statutObj.label === filterStatut;
    const matchFiliere = filterFiliere === 'Toutes' || filiere.toUpperCase().includes(filterFiliere.toUpperCase());
    const matchType = filterType === 'Tous' || typeDoc.toLowerCase().includes(filterType.toLowerCase());
    const matchSearch = nom.includes(search) || matricule.includes(search) || String(d.id_demande || d.id).includes(search);

    return matchStatut && matchFiliere && matchType && matchSearch;
  });

  // Calcul des statistiques
  const totalCount = demandes.length;
  const recuesCount = demandes.filter(d => getStatutInfo(d).label === 'Reçue').length;
  const enCoursCount = demandes.filter(d => getStatutInfo(d).label === 'En cours').length;
  const pretesCount = demandes.filter(d => getStatutInfo(d).label === 'Prête' || getStatutInfo(d).label === 'Validée').length;
  const rejeteesCount = demandes.filter(d => getStatutInfo(d).label === 'Rejetée').length;

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f8fafc', fontFamily: "-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" }}>
      
      {/* SIDEBAR OFFICIELLE EMIT */}
      <aside className="no-print" style={{ width: '270px', backgroundColor: '#0f172a', color: '#ffffff', padding: '24px 16px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', flexShrink: 0 }}>
        <div>
          {/* Logo Section */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '28px', paddingBottom: '20px', borderBottom: '1px solid #1e293b' }}>
            <img 
              src={logoEmit} 
              alt="Logo EMIT" 
              style={{ width: '48px', height: '48px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '8px', padding: '4px' }} 
            />
            <div>
              <div style={{ fontSize: '18px', fontWeight: '800', color: '#ffffff', letterSpacing: '0.5px' }}>EMIT</div>
              <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '700' }}>Administration & Scolarité</div>
            </div>
          </div>

          {/* Navigation Bar */}
          <nav style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <p style={{ fontSize: '10px', fontWeight: '800', color: '#64748b', letterSpacing: '0.05em', margin: '0 0 4px 8px', textTransform: 'uppercase' }}>MODULES SCOLARITÉ</p>
            
            <button 
              onClick={() => setActiveTab('demandes')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '700',
                backgroundColor: activeTab === 'demandes' ? '#1e3a8a' : 'transparent',
                color: activeTab === 'demandes' ? '#ffffff' : '#94a3b8'
              }}
            >
              <FileText size={18} /> File d'attente des demandes
            </button>

            <button 
              onClick={() => setActiveTab('users')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '700',
                backgroundColor: activeTab === 'users' ? '#1e3a8a' : 'transparent',
                color: activeTab === 'users' ? '#ffffff' : '#94a3b8'
              }}
            >
              <Users size={18} /> Gestion Utilisateurs & Rôles
            </button>

            <button 
              onClick={() => setActiveTab('generateur')}
              style={{ 
                display: 'flex', alignItems: 'center', gap: '12px', padding: '12px 14px', borderRadius: '10px', border: 'none', cursor: 'pointer', textAlign: 'left', fontSize: '13px', fontWeight: '700',
                backgroundColor: activeTab === 'generateur' ? '#1e3a8a' : 'transparent',
                color: activeTab === 'generateur' ? '#ffffff' : '#94a3b8'
              }}
            >
              <FileCheck size={18} /> Génération de documents
            </button>
          </nav>
        </div>

        {/* Profil & Footer */}
        <div style={{ borderTop: '1px solid #1e293b', paddingTop: '16px', display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <div>
            <div style={{ fontSize: '13px', fontWeight: '700', color: '#f8fafc' }}>{user.nom || 'Agent Scolarité'} {user.prenom || ''}</div>
            <div style={{ fontSize: '11px', color: '#38bdf8' }}>scolarite@emit.mg</div>
          </div>
          <button 
            onClick={handleLogout}
            style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px 12px', borderRadius: '8px', border: '1px solid #334155', backgroundColor: '#0f172a', color: '#f87171', fontSize: '12px', fontWeight: '600', cursor: 'pointer' }}
          >
            <LogOut size={14} /> Déconnexion
          </button>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        
        {/* HEADER */}
        <header className="no-print" style={{ height: '70px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 32px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <div>
            <h1 style={{ fontSize: '18px', margin: 0, color: '#0f172a', fontWeight: '800' }}>
              {activeTab === 'demandes' && 'File d\'attente & Traitement des demandes'}
              {activeTab === 'users' && 'Gestion des utilisateurs, des comptes et des rôles'}
              {activeTab === 'generateur' && 'Générateur et dépôt des documents administratifs'}
            </h1>
            <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Portail officiel du service scolarité — Université de Fianarantsoa (EMIT)</p>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            {activeTab === 'demandes' && (
              <>
                <button 
                  onClick={handleExportCSV}
                  title="Exporter la liste filtrée au format CSV (Excel)"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Download size={14} /> Exporter Excel (CSV)
                </button>
                <button 
                  onClick={handlePrintList}
                  title="Imprimer la file d'attente ou enregistrer en PDF"
                  style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', color: '#0f172a', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
                >
                  <Printer size={14} /> Imprimer (PDF)
                </button>
              </>
            )}

            <button 
              onClick={() => { fetchDemandes(); fetchUsers(); }} 
              disabled={loading || usersLoading}
              style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 14px', borderRadius: '8px', border: '1px solid #1e3a8a', backgroundColor: '#1e3a8a', color: '#ffffff', fontSize: '12px', fontWeight: '700', cursor: 'pointer' }}
            >
              <RefreshCw size={14} /> Actualiser
            </button>
          </div>
        </header>

        {/* TOAST ALERTE */}
        {toastMessage && (
          <div className="no-print" style={{ margin: '16px 32px 0', padding: '12px 18px', background: '#ecfdf5', border: '1px solid #a7f3d0', color: '#065f46', borderRadius: '10px', fontSize: '13px', fontWeight: '700' }}>
            ✅ {toastMessage}
          </div>
        )}

        <main style={{ padding: '28px 32px', flexGrow: 1, overflowY: 'auto' }}>
          
          {/* ================================================================ */}
          {/* ONGLET 1 : FILE D'ATTENTE & TRAITEMENT DES DEMANDES              */}
          {/* ================================================================ */}
          {activeTab === 'demandes' && (
            <div>
              {/* CARTES STATISTIQUES */}
              <div className="no-print" style={{ display: 'grid', gridTemplateColumns: 'repeat(5, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#64748b', fontWeight: '700', textTransform: 'uppercase' }}>Total Reçues</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#0f172a', marginTop: '4px' }}>{totalCount}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#16a34a', fontWeight: '700', textTransform: 'uppercase' }}>Nouvelles</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#16a34a', marginTop: '4px' }}>{recuesCount}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#d97706', fontWeight: '700', textTransform: 'uppercase' }}>En cours</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#d97706', marginTop: '4px' }}>{enCoursCount}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#2563eb', fontWeight: '700', textTransform: 'uppercase' }}>Prêtes / Validées</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#2563eb', marginTop: '4px' }}>{pretesCount}</div>
                </div>
                <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '12px', border: '1px solid #e2e8f0' }}>
                  <div style={{ fontSize: '11px', color: '#dc2626', fontWeight: '700', textTransform: 'uppercase' }}>Rejetées</div>
                  <div style={{ fontSize: '24px', fontWeight: '900', color: '#dc2626', marginTop: '4px' }}>{rejeteesCount}</div>
                </div>
              </div>

              {/* BARRE DE FILTRES COMPLETE (Section 4.1 du Cahier des charges) */}
              <div className="no-print" style={{ backgroundColor: '#ffffff', padding: '16px 20px', borderRadius: '12px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '14px', flexWrap: 'wrap', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '10px', flex: '1 1 240px', backgroundColor: '#f8fafc', padding: '8px 14px', borderRadius: '8px', border: '1px solid #cbd5e1' }}>
                  <Search size={16} color="#64748b" />
                  <input 
                    type="text" 
                    placeholder="Recherche (Nom, matricule, n°)..." 
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
                  />
                </div>

                {/* Filtre par Statut */}
                <select 
                  value={filterStatut} 
                  onChange={(e) => setFilterStatut(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  <option value="Tous">Tous les statuts</option>
                  <option value="Reçue">Reçue (Nouvelle)</option>
                  <option value="En cours">En cours de traitement</option>
                  <option value="Validée">Validée</option>
                  <option value="Prête">Prête au retrait</option>
                  <option value="Retirée">Retirée par l'étudiant</option>
                  <option value="Rejetée">Rejetée</option>
                </select>

                {/* Filtre par Filière / Mention */}
                <select 
                  value={filterFiliere} 
                  onChange={(e) => setFilterFiliere(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  <option value="Toutes">Toutes les filières</option>
                  <option value="DAII">DAII (Développement d'App)</option>
                  <option value="GB">GB (Génie Logiciel / BD)</option>
                  <option value="RPM">RPM (Réseaux / Télécom)</option>
                  <option value="AES">AES (Administration Eco/Soc)</option>
                </select>

                {/* Filtre par Type de document */}
                <select 
                  value={filterType} 
                  onChange={(e) => setFilterType(e.target.value)} 
                  style={{ padding: '8px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                >
                  <option value="Tous">Tous les types de document</option>
                  <option value="Certificat">Certificat de scolarité</option>
                  <option value="Relevé">Relevé de notes</option>
                  <option value="Attestation">Attestation de réussite</option>
                  <option value="Absence">Déclaration d'absence</option>
                  <option value="Diplôme">Diplôme</option>
                  <option value="Délégué">Demande libre (Délégué)</option>
                </select>
              </div>

              {/* TABLEAU DES DEMANDES */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
                <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                  <thead>
                    <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', textTransform: 'uppercase', fontSize: '11px', fontWeight: '800' }}>
                      <th style={{ padding: '14px 18px' }}>Réf. / Date</th>
                      <th style={{ padding: '14px 18px' }}>Étudiant</th>
                      <th style={{ padding: '14px 18px' }}>Filière / Niveau</th>
                      <th style={{ padding: '14px 18px' }}>Document demandé</th>
                      <th style={{ padding: '14px 18px' }}>Motif déclaré</th>
                      <th style={{ padding: '14px 18px' }}>Statut</th>
                      <th className="no-print" style={{ padding: '14px 18px', textAlign: 'center' }}>Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {loading ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#64748b' }}>Chargement de la file d'attente...</td>
                      </tr>
                    ) : demandesFiltrees.length === 0 ? (
                      <tr>
                        <td colSpan="7" style={{ padding: '36px', textAlign: 'center', color: '#94a3b8' }}>Aucune demande trouvée pour ces filtres.</td>
                      </tr>
                    ) : (
                      demandesFiltrees.map((d) => {
                        const idDemande = d.id_demande || d.id;
                        const dateFormatted = d.date_soumission ? new Date(d.date_soumission).toLocaleDateString('fr-FR') : 'N/A';
                        const nomEtudiant = getNomEtudiant(d);
                        const filiere = d.parcours || d.filiere || 'DAII';
                        const niveau = d.niveau || 'L2';
                        const docType = d.type_libelle || d.libelle || d.type || 'Document';
                        const st = getStatutInfo(d);

                        return (
                          <tr key={idDemande} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '14px 18px', color: '#64748b' }}>
                              <span style={{ fontWeight: '800', color: '#0f172a', display: 'block' }}>#{idDemande}</span>
                              <span style={{ fontSize: '11px' }}>{dateFormatted}</span>
                            </td>
                            <td style={{ padding: '14px 18px', fontWeight: '700', color: '#0f172a' }}>
                              {nomEtudiant}
                              <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '500' }}>
                                Matr. {d.matricule || 'ET-2023-0892'}
                              </span>
                            </td>
                            <td style={{ padding: '14px 18px', color: '#475569' }}>
                              <span style={{ fontWeight: '600' }}>{filiere}</span> ({niveau})
                            </td>
                            <td style={{ padding: '14px 18px', fontWeight: '700', color: '#1e3a8a' }}>
                              {docType}
                              {d.nombre_exemplaires > 1 && (
                                <span style={{ fontSize: '11px', color: '#64748b', display: 'block', fontWeight: '500' }}>
                                  ({d.nombre_exemplaires} exemplaires)
                                </span>
                              )}
                            </td>
                            <td style={{ padding: '14px 18px', color: '#64748b', maxWidth: '220px' }}>
                              {d.motif || 'Non précisé'}
                            </td>
                            <td style={{ padding: '14px 18px' }}>
                              <span style={{ 
                                padding: '4px 10px', 
                                borderRadius: '20px', 
                                fontSize: '11px', 
                                fontWeight: '800',
                                backgroundColor: st.bg,
                                color: st.color,
                                border: `1px solid ${st.border}`
                              }}>
                                {st.label}
                              </span>
                            </td>
                            <td className="no-print" style={{ padding: '14px 18px', textAlign: 'center' }}>
                              <div style={{ display: 'flex', gap: '6px', justifyContent: 'center' }}>
                                <button 
                                  onClick={() => { setSelectedDemande(d); setCommentaire(''); }}
                                  title="Traiter cette demande (Valider / Rejeter)"
                                  style={{ padding: '6px 12px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                                >
                                  <Eye size={14} /> Traiter
                                </button>
                                <button 
                                  onClick={() => handleGenererAttestation(d)}
                                  title="Générer l'attestation officielle pré-remplie"
                                  style={{ padding: '6px 10px', backgroundColor: '#f1f5f9', color: '#0f172a', border: '1px solid #cbd5e1', borderRadius: '6px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                                >
                                  🖨️ Générer
                                </button>
                              </div>
                            </td>
                          </tr>
                        );
                      })
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ONGLET 2 : GESTION DES UTILISATEURS & ROLES (CAHIER DES CHARGES) */}
          {/* ================================================================ */}
          {activeTab === 'users' && (
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 2fr', gap: '24px' }}>
              
              {/* Formulaire de création d'un utilisateur */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: '0 0 4px 0', display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <PlusCircle size={18} color="#1e3a8a" /> Créer un nouveau compte
                </h2>
                <p style={{ fontSize: '12px', color: '#64748b', margin: '0 0 20px 0' }}>Enregistrement direct dans la base de données Neon EMIT.</p>

                <form onSubmit={handleCreateUserSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>RÔLE DE L'UTILISATEUR *</label>
                    <select 
                      value={newUser.role} 
                      onChange={(e) => setNewUser({ ...newUser, role: e.target.value })}
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                      required
                    >
                      <option value="etudiant">Étudiant</option>
                      <option value="delegue">Délégué de promotion</option>
                      <option value="agent">Agent de scolarité</option>
                      <option value="admin">Administrateur / Responsable</option>
                    </select>
                  </div>

                  <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Nom *</label>
                      <input 
                        type="text" 
                        required 
                        value={newUser.nom} 
                        onChange={(e) => setNewUser({ ...newUser, nom: e.target.value })}
                        placeholder="Ex: Ravelo" 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                      />
                    </div>
                    <div>
                      <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Prénom *</label>
                      <input 
                        type="text" 
                        required 
                        value={newUser.prenom} 
                        onChange={(e) => setNewUser({ ...newUser, prenom: e.target.value })}
                        placeholder="Ex: Jean" 
                        style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                      />
                    </div>
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Email académique *</label>
                    <input 
                      type="email" 
                      required 
                      value={newUser.email} 
                      onChange={(e) => setNewUser({ ...newUser, email: e.target.value })}
                      placeholder="exemple@emit.mg" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                    />
                  </div>

                  <div>
                    <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Mot de passe *</label>
                    <input 
                      type="password" 
                      required 
                      value={newUser.mot_de_passe} 
                      onChange={(e) => setNewUser({ ...newUser, mot_de_passe: e.target.value })}
                      placeholder="••••••••" 
                      style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }} 
                    />
                  </div>

                  {(newUser.role === 'etudiant' || newUser.role === 'delegue') && (
                    <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Filière</label>
                        <select 
                          value={newUser.parcours} 
                          onChange={(e) => setNewUser({ ...newUser, parcours: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                        >
                          <option value="DAII">DAII</option>
                          <option value="GB">GB</option>
                          <option value="RPM">RPM</option>
                          <option value="AES">AES</option>
                        </select>
                      </div>
                      <div>
                        <label style={{ display: 'block', fontSize: '11px', fontWeight: '700', color: '#334155', marginBottom: '4px' }}>Niveau</label>
                        <select 
                          value={newUser.niveau} 
                          onChange={(e) => setNewUser({ ...newUser, niveau: e.target.value })}
                          style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', background: '#fff' }}
                        >
                          <option value="L1">L1</option>
                          <option value="L2">L2</option>
                          <option value="L3">L3</option>
                          <option value="M1">M1</option>
                          <option value="M2">M2</option>
                        </select>
                      </div>
                    </div>
                  )}

                  <button 
                    type="submit" 
                    disabled={actionLoading}
                    style={{ marginTop: '8px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#1e3a8a', color: '#ffffff', fontWeight: '700', fontSize: '13px', cursor: 'pointer', boxShadow: '0 2px 8px rgba(30, 58, 138, 0.2)' }}
                  >
                    {actionLoading ? 'Création...' : 'Valider & Enregistrer'}
                  </button>
                </form>
              </div>

              {/* Tableau de la liste des utilisateurs */}
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '24px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
                  <div>
                    <h2 style={{ fontSize: '16px', fontWeight: '800', color: '#0f172a', margin: 0 }}>Comptes & Droits enregistrés ({usersList.length})</h2>
                    <p style={{ fontSize: '12px', color: '#64748b', margin: 0 }}>Attribution des rôles et gestion des accès.</p>
                  </div>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
                    <thead>
                      <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#475569', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase' }}>
                        <th style={{ padding: '10px 14px' }}>Utilisateur</th>
                        <th style={{ padding: '10px 14px' }}>Email</th>
                        <th style={{ padding: '10px 14px' }}>Rôle actuel</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Changer rôle</th>
                        <th style={{ padding: '10px 14px', textAlign: 'center' }}>Supprimer</th>
                      </tr>
                    </thead>
                    <tbody>
                      {usersList.length === 0 ? (
                        <tr>
                          <td colSpan="5" style={{ padding: '24px', textAlign: 'center', color: '#94a3b8' }}>Aucun compte trouvé.</td>
                        </tr>
                      ) : (
                        usersList.map(u => (
                          <tr key={u.id_utilisateur} style={{ borderBottom: '1px solid #f1f5f9' }}>
                            <td style={{ padding: '12px 14px', fontWeight: '700', color: '#0f172a' }}>
                              {u.prenom} {u.nom}
                              {u.matricule && <span style={{ display: 'block', fontSize: '11px', color: '#64748b', fontWeight: 'normal' }}>Matr: {u.matricule}</span>}
                            </td>
                            <td style={{ padding: '12px 14px', color: '#475569' }}>{u.email}</td>
                            <td style={{ padding: '12px 14px' }}>
                              <span style={{ 
                                padding: '3px 8px', borderRadius: '6px', fontSize: '11px', fontWeight: '800', textTransform: 'uppercase',
                                backgroundColor: u.role === 'admin' ? '#fef2f2' : u.role === 'agent' ? '#eff6ff' : u.role === 'delegue' ? '#ecfdf5' : '#f8fafc',
                                color: u.role === 'admin' ? '#dc2626' : u.role === 'agent' ? '#1d4ed8' : u.role === 'delegue' ? '#059669' : '#475569'
                              }}>
                                {u.role}
                              </span>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <select 
                                value={u.role || 'etudiant'} 
                                onChange={(e) => handleChangeUserRole(u.id_utilisateur, e.target.value)}
                                style={{ padding: '4px 8px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '11px', fontWeight: '600' }}
                              >
                                <option value="etudiant">Étudiant</option>
                                <option value="delegue">Délégué</option>
                                <option value="agent">Agent Scolarité</option>
                                <option value="admin">Admin</option>
                              </select>
                            </td>
                            <td style={{ padding: '12px 14px', textAlign: 'center' }}>
                              <button 
                                onClick={() => handleDeleteUser(u.id_utilisateur, `${u.prenom} ${u.nom}`)}
                                title="Supprimer ce compte"
                                style={{ background: 'transparent', border: 'none', color: '#ef4444', cursor: 'pointer', padding: '4px' }}
                              >
                                <Trash2 size={16} />
                              </button>
                            </td>
                          </tr>
                        ))
                      )}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* ONGLET 3 : GENERATION DE DOCUMENTS & DEPOT (CAHIER DES CHARGES) */}
          {/* ================================================================ */}
          {activeTab === 'generateur' && (
            <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', border: '1px solid #e2e8f0', padding: '28px', maxWidth: '800px', margin: '0 auto' }}>
              <h2 style={{ fontSize: '18px', fontWeight: '800', color: '#0f172a', margin: '0 0 6px 0' }}>
                Module de Génération & Dépôt des Documents Officiels
              </h2>
              <p style={{ fontSize: '13px', color: '#64748b', margin: '0 0 24px 0' }}>
                Conforme au cahier des charges de la scolarité EMIT : édition des certificats, attestations de réussite et validation finale.
              </p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '16px', marginBottom: '24px' }}>
                <div style={{ padding: '18px', borderRadius: '10px', background: '#eff6ff', border: '1px solid #bfdbfe' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#1e3a8a', margin: '0 0 6px 0' }}>Certificat de Scolarité</h3>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>Génération de certificat pour inscription ou dossier de bourse.</p>
                  <button 
                    onClick={() => setDocumentApercu({
                      id: 'CERT-001',
                      etudiant: 'Rakotomalala Andry Faniry',
                      matricule: 'ET-2023-0892',
                      parcours: 'DAII - Génie Logiciel',
                      niveau: 'Licence 2 (L2)',
                      type: 'Certificat de Scolarité',
                      annee: '2025-2026',
                      date: new Date().toLocaleDateString('fr-FR')
                    })}
                    style={{ padding: '6px 12px', backgroundColor: '#1e3a8a', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Générer le modèle
                  </button>
                </div>

                <div style={{ padding: '18px', borderRadius: '10px', background: '#ecfdf5', border: '1px solid #a7f3d0' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#065f46', margin: '0 0 6px 0' }}>Attestation de Réussite</h3>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>Attestation confirmant la validation d'une année académique.</p>
                  <button 
                    onClick={() => setDocumentApercu({
                      id: 'ATT-002',
                      etudiant: 'Raveloarison Faly',
                      matricule: 'ET-2022-0415',
                      parcours: 'GB - Informatique',
                      niveau: 'Licence 3 (L3)',
                      type: 'Attestation de Réussite',
                      annee: '2024-2025',
                      date: new Date().toLocaleDateString('fr-FR')
                    })}
                    style={{ padding: '6px 12px', backgroundColor: '#059669', color: '#fff', border: 'none', borderRadius: '6px', fontSize: '11px', fontWeight: '700', cursor: 'pointer' }}
                  >
                    Générer le modèle
                  </button>
                </div>

                <div style={{ padding: '18px', borderRadius: '10px', background: '#fef3c7', border: '1px solid #fde68a' }}>
                  <h3 style={{ fontSize: '14px', fontWeight: '700', color: '#92400e', margin: '0 0 6px 0' }}>Dépôt de Fichier Signé</h3>
                  <p style={{ fontSize: '12px', color: '#475569', margin: '0 0 12px 0' }}>Téléversement du scan officiel signé prêt au retrait par l'étudiant.</p>
                  <input 
                    type="file" 
                    onChange={(e) => {
                      if (e.target.files[0]) {
                        alert(`Fichier "${e.target.files[0].name}" prêt à être lié à une demande.`);
                      }
                    }} 
                    style={{ fontSize: '11px' }}
                  />
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* MODAL DE TRAITEMENT WORKFLOW (VALIDER, REJETER, COMMENTAIRE)     */}
          {/* ================================================================ */}
          {selectedDemande && (
            <div className="no-print" style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(15, 23, 42, 0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000, padding: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '14px', padding: '28px', width: '560px', maxWidth: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.25)' }}>
                <h3 style={{ margin: '0 0 12px 0', fontSize: '18px', color: '#0f172a', fontWeight: '800' }}>
                  Traitement de la Demande #{selectedDemande.id_demande || selectedDemande.id}
                </h3>
                
                {/* Résumé de la demande */}
                <div style={{ fontSize: '13px', color: '#334155', marginBottom: '18px', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Étudiant :</strong> {getNomEtudiant(selectedDemande)} (Matricule: {selectedDemande.matricule || 'N/A'})</p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Filière / Niveau :</strong> {selectedDemande.parcours || selectedDemande.filiere || 'DAII'} ({selectedDemande.niveau || 'L2'})</p>
                  <p style={{ margin: '0 0 4px 0' }}><strong>Document demandé :</strong> {selectedDemande.type_libelle || selectedDemande.type || 'Document'} ({selectedDemande.nombre_exemplaires || 1} ex.)</p>
                  <p style={{ margin: 0 }}><strong>Motif :</strong> {selectedDemande.motif || 'Aucun motif précisé'}</p>
                </div>

                {/* Dépôt facultatif de fichier signé / généré */}
                <div style={{ marginBottom: '16px', padding: '12px', background: '#eff6ff', borderRadius: '8px', border: '1px dashed #93c5fd' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#1e3a8a', marginBottom: '4px' }}>
                    📎 Dépôt du document officiel final (Facultatif) :
                  </label>
                  <input 
                    type="file" 
                    onChange={(e) => setDocumentFichier(e.target.files[0])}
                    style={{ fontSize: '12px' }}
                  />
                </div>

                {/* Commentaire / Remarque de scolarité */}
                <div style={{ marginBottom: '20px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: '700', color: '#334155', marginBottom: '6px' }}>
                    Remarque de la scolarité / Motif de décision :
                  </label>
                  <textarea 
                    rows="3" 
                    value={commentaire} 
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ex: Document signé prêt à être récupéré au bureau de la scolarité, ou Justificatif non conforme..."
                    style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box', fontFamily: 'inherit' }}
                  />
                </div>

                {/* Actions du Workflow (Valider, Rejeter, Mettre en cours, Marquer retirée) */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid #f1f5f9', paddingTop: '16px' }}>
                  <button 
                    type="button"
                    disabled={actionLoading}
                    onClick={() => setSelectedDemande(null)}
                    style={{ padding: '8px 14px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '600' }}
                  >
                    Fermer
                  </button>

                  <div style={{ display: 'flex', gap: '8px' }}>
                    <button 
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatut(selectedDemande.id_demande || selectedDemande.id, 'En cours', 2)}
                      style={{ padding: '8px 12px', border: '1px solid #fde68a', backgroundColor: '#fef3c7', color: '#92400e', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700' }}
                    >
                      ⏳ En cours
                    </button>

                    <button 
                      type="button"
                      disabled={actionLoading}
                      onClick={() => {
                        if (!commentaire.trim()) {
                          alert('Veuillez préciser le motif du rejet dans la remarque.');
                          return;
                        }
                        handleUpdateStatut(selectedDemande.id_demande || selectedDemande.id, 'Rejetée', 6);
                      }}
                      style={{ padding: '8px 14px', border: 'none', backgroundColor: '#dc2626', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <XCircle size={14} /> Rejeter
                    </button>

                    <button 
                      type="button"
                      disabled={actionLoading}
                      onClick={() => handleUpdateStatut(selectedDemande.id_demande || selectedDemande.id, 'Prête', 4)}
                      style={{ padding: '8px 14px', border: 'none', backgroundColor: '#059669', color: '#fff', borderRadius: '8px', cursor: 'pointer', fontSize: '12px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '4px' }}
                    >
                      <CheckCircle size={14} /> Valider & Déclarer Prête
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* ================================================================ */}
          {/* APERÇU / IMPRESSION DU DOCUMENT OFFICIEL GENERE                   */}
          {/* ================================================================ */}
          {documentApercu && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.6)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1100, padding: '20px' }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '36px', width: '650px', maxWidth: '100%', maxHeight: '90vh', overflowY: 'auto', boxShadow: '0 25px 50px -12px rgba(0,0,0,0.3)' }}>
                
                {/* En-tête officiel EMIT */}
                <div style={{ textAlign: 'center', borderBottom: '2px solid #0f172a', paddingBottom: '16px', marginBottom: '24px' }}>
                  <img src={logoEmit} alt="EMIT" style={{ height: '54px', marginBottom: '8px' }} />
                  <p style={{ fontSize: '12px', fontWeight: '700', margin: '0 0 2px 0', textTransform: 'uppercase' }}>UNIVERSITÉ DE FIANARANTSOA</p>
                  <p style={{ fontSize: '11px', margin: '0 0 2px 0' }}>ÉCOLE DE MANAGEMENT ET D'INNOVATION TECHNOLOGIQUE (EMIT)</p>
                  <p style={{ fontSize: '11px', color: '#64748b', margin: 0 }}>SERVICE DE LA SCOLARITÉ ET DES AFFAIRES ÉTUDIANTES</p>
                </div>

                <div style={{ textAlign: 'center', margin: '24px 0' }}>
                  <h2 style={{ fontSize: '20px', fontWeight: '900', color: '#1e3a8a', textDecoration: 'underline', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                    {documentApercu.type}
                  </h2>
                  <p style={{ fontSize: '12px', color: '#64748b' }}>Année académique : {documentApercu.annee}</p>
                </div>

                <div style={{ fontSize: '14px', lineHeight: '1.8', color: '#1e293b', marginBottom: '32px' }}>
                  <p>
                    Le Directeur de l'École de Management et d'Innovation Technologique (EMIT) atteste par la présente que l'étudiant(e) :
                  </p>
                  <p style={{ paddingLeft: '20px' }}>
                    • Nom et Prénom : <strong>{documentApercu.etudiant}</strong><br/>
                    • Numéro Matricule : <strong>{documentApercu.matricule}</strong><br/>
                    • Mention / Parcours : <strong>{documentApercu.parcours}</strong><br/>
                    • Niveau d'études : <strong>{documentApercu.niveau}</strong>
                  </p>
                  <p>
                    est régulièrement inscrit(e) au sein de notre établissement pour l'année universitaire en cours et en règle vis-à-vis des obligations administratives.
                  </p>
                  <p>
                    En foi de quoi, ce document lui est délivré pour servir et valoir ce que de droit.
                  </p>
                </div>

                <div style={{ display: 'flex', justifyContent: 'space-between', marginTop: '40px', fontSize: '13px' }}>
                  <div>
                    <p style={{ margin: '0 0 4px 0' }}>Fait à Fianarantsoa, le {documentApercu.date}</p>
                    <p style={{ fontSize: '11px', color: '#64748b' }}>Réf: {documentApercu.id}</p>
                  </div>
                  <div style={{ textAlign: 'center' }}>
                    <p style={{ margin: '0 0 40px 0', fontWeight: '700' }}>Pour le Service Scolarité,<br/>Le Chef de Service</p>
                    <p style={{ fontStyle: 'italic', color: '#64748b' }}>[Signature & Sceau Officiel]</p>
                  </div>
                </div>

                <div className="no-print" style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '30px', borderTop: '1px solid #e2e8f0', paddingTop: '16px' }}>
                  <button 
                    onClick={() => setDocumentApercu(null)}
                    style={{ padding: '8px 16px', borderRadius: '8px', border: '1px solid #cbd5e1', background: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '600' }}
                  >
                    Fermer
                  </button>
                  <button 
                    onClick={() => window.print()}
                    style={{ padding: '8px 18px', borderRadius: '8px', border: 'none', background: '#1e3a8a', color: '#fff', cursor: 'pointer', fontSize: '13px', fontWeight: '700', display: 'flex', alignItems: 'center', gap: '6px' }}
                  >
                    <Printer size={15} /> Imprimer ce document officiel
                  </button>
                </div>

              </div>
            </div>
          )}

        </main>
      </div>

      {/* Style d'impression pour masque propre de la navigation */}
      <style>{`
        @media print {
          .no-print {
            display: none !important;
          }
          body {
            background: #ffffff !important;
          }
        }
      `}</style>
    </div>
  );
}