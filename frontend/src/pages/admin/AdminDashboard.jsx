import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { 
  FileText, 
  Search, 
  LogOut, 
  Eye 
} from 'lucide-react';

// Importation du logo (Assure-toi que le fichier logo-emit.png est dans src/assets/)
import logoEmit from '../../assets/logo-emit.png.jpg';


const AdminDashboard = () => {
  // DONNÉES MOCKÉES (FAUSSES DONNÉES POUR TESTER SANS BACKEND)
  const [demandes, setDemandes] = useState([
   
  ]);

  // États pour les filtres
  const [filterStatut, setFilterStatut] = useState('Tous');
  const [filterFiliere, setFilterFiliere] = useState('Toutes');
  const [searchTerm, setSearchTerm] = useState('');

  // État pour la fenêtre modale de traitement
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [commentaire, setCommentaire] = useState('');

  const API_URL = 'http://localhost:5000/api/admin';

  useEffect(() => {
    // Si tu veux tenter la connexion au vrai backend, décommente la ligne ci-dessous :
    // fetchDemandes();
    fetchDemandes();
  }, []);

  const fetchDemandes = async () => {
    try {
      const res = await axios.get(`${API_URL}/demandes`);
      if (res.data && res.data.length > 0) {
        setDemandes(res.data);
      }
    } catch (err) {
      console.log('Backend non disponible, utilisation des données de test (Mock).');
    }
  };

  // Mettre à jour le statut (Fonctionne en mode test Mock et en Backend)
  const handleUpdateStatut = async (id_demande, nouveauStatut) => {
    try {
      // Tente d'envoyer au backend si disponible
      await axios.patch(`${API_URL}/demandes/${id_demande}`, {
        statut: nouveauStatut,
        commentaire: commentaire
      });
    } catch (err) {
      console.log('Mise à jour en mode test local.');
    }

    // Mise à jour de l'affichage localement
    setDemandes(prev => prev.map(d => 
      d.id_demande === id_demande ? { ...d, statut: nouveauStatut } : d
    ));

    setCommentaire('');
    setSelectedDemande(null);
  };

  // Filtrage dynamique
  const demandesFiltrees = demandes.filter(d => {
    const matchStatut = filterStatut === 'Tous' || (d.statut || 'En attente') === filterStatut;
    const matchFiliere = filterFiliere === 'Toutes' || d.filiere === filterFiliere;
    const matchSearch = (d.nom_etudiant || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
                        (d.matricule || '').toLowerCase().includes(searchTerm.toLowerCase());

    return matchStatut && matchFiliere && matchSearch;
  });

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: '#f4f6f9', fontFamily: "'Segoe UI', sans-serif" }}>
      
      {/* SIDEBAR ADMIN */}
      <aside style={{ width: '260px', backgroundColor: '#0f172a', color: '#ffffff', padding: '20px', display: 'flex', flexDirection: 'column' }}>
        
        {/* LOGO EMIT ET EN-TÊTE SIDEBAR */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px', marginBottom: '30px', borderBottom: '1px solid #1e293b', paddingBottom: '16px' }}>
          <img 
            src={logoEmit} 
            alt="Logo EMIT" 
            style={{ width: '45px', height: '45px', objectFit: 'contain', backgroundColor: '#ffffff', borderRadius: '6px', padding: '2px' }} 
          />
          <div>
            <div style={{ fontSize: '18px', fontWeight: 'bold', color: '#ffffff', letterSpacing: '0.5px' }}>EMIT</div>
            <div style={{ fontSize: '11px', color: '#38bdf8', fontWeight: '600' }}>Espace Scolarité</div>
          </div>
        </div>

        <nav style={{ display: 'flex', flexDirection: 'column', gap: '10px', flexGrow: 1 }}>
          <button style={{ display: 'flex', alignItems: 'center', gap: '10px', padding: '12px', borderRadius: '8px', border: 'none', backgroundColor: '#1e293b', color: '#ffffff', fontWeight: 'bold', cursor: 'pointer', textAlign: 'left' }}>
            <FileText size={18} /> File d'attente
          </button>
        </nav>

        <div style={{ borderTop: '1px solid #334155', paddingTop: '15px' }}>
          <div style={{ fontSize: '13px', fontWeight: 'bold' }}>Agent Scolarité</div>
          <div style={{ fontSize: '11px', color: '#94a3b8' }}>scolarite@emit.mg</div>
        </div>
      </aside>

      {/* CONTENU PRINCIPAL */}
      <div style={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        
        {/* HEADER */}
        <header style={{ height: '65px', backgroundColor: '#ffffff', borderBottom: '1px solid #e2e8f0', padding: '0 30px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
          <h2 style={{ fontSize: '18px', margin: 0, color: '#0f172a' }}>Gestion des Demandes de Documents</h2>
          <button style={{ display: 'flex', alignItems: 'center', gap: '6px', padding: '8px 12px', border: '1px solid #cbd5e1', backgroundColor: '#ffffff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}>
            <LogOut size={16} /> Déconnexion
          </button>
        </header>

        <main style={{ padding: '30px', flexGrow: 1 }}>
          
          {/* CARTES STATISTIQUES */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: '20px', marginBottom: '25px' }}>
            <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#64748b' }}>Total Demandes</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#0f172a' }}>{demandes.length}</div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#d97706' }}>En Attente</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#d97706' }}>
                {demandes.filter(d => !d.statut || d.statut === 'En attente').length}
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#059669' }}>Validées</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#059669' }}>
                {demandes.filter(d => d.statut === 'Validée').length}
              </div>
            </div>
            <div style={{ backgroundColor: '#ffffff', padding: '18px', borderRadius: '10px', border: '1px solid #e2e8f0' }}>
              <div style={{ fontSize: '12px', color: '#dc2626' }}>Rejetées</div>
              <div style={{ fontSize: '24px', fontWeight: 'bold', color: '#dc2626' }}>
                {demandes.filter(d => d.statut === 'Rejetée').length}
              </div>
            </div>
          </div>

          {/* BARRE DE FILTRES */}
          <div style={{ backgroundColor: '#ffffff', padding: '16px', borderRadius: '10px', border: '1px solid #e2e8f0', marginBottom: '20px', display: 'flex', gap: '15px', flexWrap: 'wrap', alignItems: 'center' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexGrow: 1, backgroundColor: '#f8fafc', padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1' }}>
              <Search size={16} color="#64748b" />
              <input 
                type="text" 
                placeholder="Rechercher un étudiant ou matricule..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                style={{ border: 'none', background: 'transparent', outline: 'none', width: '100%', fontSize: '13px' }}
              />
            </div>

            <select value={filterStatut} onChange={(e) => setFilterStatut(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
              <option value="Tous">Tous les statuts</option>
              <option value="En attente">En attente</option>
              <option value="Validée">Validée</option>
              <option value="Rejetée">Rejetée</option>
            </select>

            <select value={filterFiliere} onChange={(e) => setFilterFiliere(e.target.value)} style={{ padding: '8px 12px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px' }}>
              <option value="Toutes">Toutes les filières</option>
              <option value="DAII">DAII</option>
              <option value="RPM">RPM</option>
              <option value="AES">AES</option>
            </select>
          </div>

          {/* TABLEAU */}
          <div style={{ backgroundColor: '#ffffff', borderRadius: '10px', border: '1px solid #e2e8f0', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '13px' }}>
              <thead>
                <tr style={{ backgroundColor: '#f8fafc', borderBottom: '1px solid #e2e8f0', color: '#64748b', textTransform: 'uppercase', fontSize: '11px' }}>
                  <th style={{ padding: '12px 16px' }}>Date</th>
                  <th style={{ padding: '12px 16px' }}>Étudiant</th>
                  <th style={{ padding: '12px 16px' }}>Filière / Niveau</th>
                  <th style={{ padding: '12px 16px' }}>Document</th>
                  <th style={{ padding: '12px 16px' }}>Motif</th>
                  <th style={{ padding: '12px 16px' }}>Statut</th>
                  <th style={{ padding: '12px 16px', textAlign: 'center' }}>Action</th>
                </tr>
              </thead>
              <tbody>
                {demandesFiltrees.length === 0 ? (
                  <tr>
                    <td colSpan="7" style={{ padding: '30px', textAlign: 'center', color: '#94a3b8' }}>Aucune demande trouvée.</td>
                  </tr>
                ) : (
                  demandesFiltrees.map((d) => (
                    <tr key={d.id_demande} style={{ borderBottom: '1px solid #f1f5f9' }}>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{d.date_soumission}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '600', color: '#0f172a' }}>
                        {d.nom_etudiant} <span style={{ fontSize: '11px', color: '#94a3b8', display: 'block' }}>{d.matricule}</span>
                      </td>
                      <td style={{ padding: '12px 16px', color: '#475569' }}>{d.filiere} - {d.niveau}</td>
                      <td style={{ padding: '12px 16px', fontWeight: '500', color: '#0284c7' }}>{d.type_libelle}</td>
                      <td style={{ padding: '12px 16px', color: '#64748b' }}>{d.motif}</td>
                      <td style={{ padding: '12px 16px' }}>
                        <span style={{ 
                          padding: '4px 8px', 
                          borderRadius: '4px', 
                          fontSize: '11px', 
                          fontWeight: 'bold',
                          backgroundColor: d.statut === 'Validée' ? '#dcfce7' : d.statut === 'Rejetée' ? '#fee2e2' : '#fef3c7',
                          color: d.statut === 'Validée' ? '#15803d' : d.statut === 'Rejetée' ? '#b91c1c' : '#b45309'
                        }}>
                          {d.statut}
                        </span>
                      </td>
                      <td style={{ padding: '12px 16px', textAlign: 'center' }}>
                        <button 
                          onClick={() => setSelectedDemande(d)}
                          style={{ padding: '6px 10px', backgroundColor: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer', fontSize: '12px', display: 'inline-flex', alignItems: 'center', gap: '4px' }}
                        >
                          <Eye size={14} /> Traiter
                        </button>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* MODAL DE TRAITEMENT */}
          {selectedDemande && (
            <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
              <div style={{ backgroundColor: '#ffffff', borderRadius: '12px', padding: '24px', width: '480px', maxWidth: '90%' }}>
                <h3 style={{ margin: '0 0 10px 0', fontSize: '16px', color: '#0f172a' }}>
                  Traiter la demande #{selectedDemande.id_demande}
                </h3>
                <div style={{ fontSize: '13px', color: '#475569', marginBottom: '15px', lineHeight: '1.6', backgroundColor: '#f8fafc', padding: '12px', borderRadius: '6px' }}>
                  <strong>Étudiant :</strong> {selectedDemande.nom_etudiant} ({selectedDemande.filiere} {selectedDemande.niveau})<br/>
                  <strong>Document :</strong> {selectedDemande.type_libelle}<br/>
                  <strong>Motif :</strong> {selectedDemande.motif}
                </div>

                <div style={{ marginBottom: '15px' }}>
                  <label style={{ display: 'block', fontSize: '12px', fontWeight: 'bold', color: '#334155', marginBottom: '6px' }}>
                    Remarque / Motif de décision :
                  </label>
                  <textarea 
                    rows="3" 
                    value={commentaire} 
                    onChange={(e) => setCommentaire(e.target.value)}
                    placeholder="Ex: Document prêt, ou Raison du rejet..."
                    style={{ width: '100%', padding: '10px', borderRadius: '6px', border: '1px solid #cbd5e1', fontSize: '13px', boxSizing: 'border-box' }}
                  />
                </div>

                <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
                  <button 
                    onClick={() => setSelectedDemande(null)}
                    style={{ padding: '8px 14px', border: '1px solid #cbd5e1', backgroundColor: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px' }}
                  >
                    Annuler
                  </button>
                  <button 
                    onClick={() => handleUpdateStatut(selectedDemande.id_demande, 'Rejetée')}
                    style={{ padding: '8px 14px', border: 'none', backgroundColor: '#dc2626', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Rejeter
                  </button>
                  <button 
                    onClick={() => handleUpdateStatut(selectedDemande.id_demande, 'Validée')}
                    style={{ padding: '8px 14px', border: 'none', backgroundColor: '#059669', color: '#fff', borderRadius: '6px', cursor: 'pointer', fontSize: '13px', fontWeight: 'bold' }}
                  >
                    Valider
                  </button>
                </div>
              </div>
            </div>
          )}
         
        </main>
      </div>
    </div>
  );
};

export default AdminDashboard;