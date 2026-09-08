// frontend/src/pages/student/StudentDashboard.jsx
import React, { useState, useEffect } from 'react';
import axios from 'axios';

const StudentDashboard = () => {
  // Identification de l'étudiant
  const [user] = useState({
    id_utilisateur: 1,
    id_etudiant: 1,
    isDelegue: true
  });

  const [demandes, setDemandes] = useState([]);
  const [typesDemandes, setTypesDemandes] = useState([]);
  const [activeTab, setActiveTab] = useState('liste'); // 'liste', 'nouveau', 'delegue'

  // Formulaire nouvelle demande standard
  const [idType, setIdType] = useState('');
  const [motif, setMotif] = useState('');
  const [nombreExemplaires, setNombreExemplaires] = useState(1);

  // Formulaire demande délégué
  const [delegueMotif, setDelegueMotif] = useState('');
  const [delegueIdType, setDelegueIdType] = useState('');
  const [delegueExemplaires, setDelegueExemplaires] = useState(1);
  const [delegueCibleEtudiant, setDelegueCibleEtudiant] = useState('');

  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  const API_URL = 'http://localhost:5000/api/student';

  // Charger les types de demandes et les demandes
  useEffect(() => {
    fetchTypes();
    fetchDemandes();
  }, [user.id_etudiant]);

  const fetchTypes = async () => {
    try {
      const response = await axios.get(`${API_URL}/types`);
      setTypesDemandes(response.data);
      if (response.data.length > 0) {
        setIdType(response.data[0].id_type);
        setDelegueIdType(response.data[0].id_type);
      }
    } catch (err) {
      console.error('Erreur chargement types :', err);
    }
  };

  const fetchDemandes = async () => {
    try {
      const response = await axios.get(`${API_URL}/demandes/${user.id_etudiant}`);
      setDemandes(response.data);
    } catch (err) {
      console.error('Erreur chargement demandes :', err);
    }
  };

  const handleCreateDemande = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await axios.post(`${API_URL}/demandes`, {
        id_etudiant: user.id_etudiant,
        id_type: idType,
        motif,
        nombre_exemplaires: Number(nombreExemplaires)
      });

      setMessage('Demande soumise avec succès !');
      setMotif('');
      setNombreExemplaires(1);
      fetchDemandes();
      setActiveTab('liste');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission de la demande.');
    }
  };

  const handleCreateDemandeDelegue = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      await axios.post(`${API_URL}/demandes/delegue`, {
        id_utilisateur: user.id_utilisateur,
        id_etudiant: delegueCibleEtudiant || user.id_etudiant,
        id_type: delegueIdType,
        motif: delegueMotif,
        nombre_exemplaires: Number(delegueExemplaires)
      });

      setMessage('Demande libre de délégué soumise avec succès !');
      setDelegueMotif('');
      setDelegueExemplaires(1);
      setDelegueCibleEtudiant('');
      fetchDemandes();
      setActiveTab('liste');
    } catch (err) {
      setError(err.response?.data?.error || 'Erreur lors de la soumission de la demande délégué.');
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif', maxWidth: '1000px', margin: '0 auto' }}>
      <h2>Tableau de Bord Étudiant - EMIT</h2>

      {/* Barre de navigation / Onglets */}
      <div style={{ marginBottom: '20px', display: 'flex', gap: '10px' }}>
        <button
          onClick={() => setActiveTab('liste')}
          style={{ padding: '10px 15px', background: activeTab === 'liste' ? '#007bff' : '#f8f9fa', color: activeTab === 'liste' ? '#fff' : '#000', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Mes Demandes
        </button>
        <button
          onClick={() => setActiveTab('nouveau')}
          style={{ padding: '10px 15px', background: activeTab === 'nouveau' ? '#007bff' : '#f8f9fa', color: activeTab === 'nouveau' ? '#fff' : '#000', border: '1px solid #ccc', cursor: 'pointer' }}
        >
          Nouvelle Demande
        </button>
        {user.isDelegue && (
          <button
            onClick={() => setActiveTab('delegue')}
            style={{ padding: '10px 15px', background: activeTab === 'delegue' ? '#28a745' : '#f8f9fa', color: activeTab === 'delegue' ? '#fff' : '#000', border: '1px solid #ccc', cursor: 'pointer' }}
          >
            Espace Délégué (Demande Libre)
          </button>
        )}
      </div>

      {/* Notifications */}
      {message && <div style={{ padding: '10px', background: '#d4edda', color: '#155724', marginBottom: '15px', border: '1px solid #c3e6cb' }}>{message}</div>}
      {error && <div style={{ padding: '10px', background: '#f8d7da', color: '#721c24', marginBottom: '15px', border: '1px solid #f5c6cb' }}>{error}</div>}

      {/* CONTENU : Liste des demandes */}
      {activeTab === 'liste' && (
        <div>
          <h3>Historique de mes demandes</h3>
          {demandes.length === 0 ? (
            <p>Aucune demande enregistrée pour le moment.</p>
          ) : (
            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '10px' }}>
              <thead>
                <tr style={{ background: '#f2f2f2', textAlign: 'left' }}>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>ID</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Date</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Type</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Motif</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Exemplaires</th>
                  <th style={{ border: '1px solid #ddd', padding: '8px' }}>Statut</th>
                </tr>
              </thead>
              <tbody>
                {demandes.map((d) => (
                  <tr key={d.id_demande}>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{d.id_demande}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{new Date(d.date_soumission).toLocaleDateString()}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{d.type_libelle || d.nom_type || d.libelle_type}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{d.motif}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px' }}>{d.nombre_exemplaires}</td>
                    <td style={{ border: '1px solid #ddd', padding: '8px', fontWeight: 'bold', color: '#0056b3' }}>
                      {d.statut_libelle || d.libelle_statut}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}

      {/* CONTENU : Formulaire Nouvelle Demande */}
      {activeTab === 'nouveau' && (
        <div style={{ background: '#f9f9f9', padding: '20px', border: '1px solid #ddd' }}>
          <h3>Soumettre une nouvelle demande</h3>
          <form onSubmit={handleCreateDemande} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Type de demande :</label>
              <select
                value={idType}
                onChange={(e) => setIdType(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              >
                {typesDemandes.map((type) => (
                  <option key={type.id_type} value={type.id_type}>
                    {type.nom_type || type.libelle_type || type.libelle || `Document N°${type.id_type}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Motif :</label>
              <textarea
                value={motif}
                onChange={(e) => setMotif(e.target.value)}
                rows="4"
                style={{ width: '100%', padding: '8px' }}
                placeholder="Précisez votre motif ici..."
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre d'exemplaires :</label>
              <input
                type="number"
                min="1"
                value={nombreExemplaires}
                onChange={(e) => setNombreExemplaires(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>

            <button type="submit" style={{ padding: '10px', background: '#007bff', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Envoyer la demande
            </button>
          </form>
        </div>
      )}

      {/* CONTENU : Espace Délégué */}
      {activeTab === 'delegue' && user.isDelegue && (
        <div style={{ background: '#e9f7ef', padding: '20px', border: '1px solid #c3e6cb' }}>
          <h3 style={{ color: '#155724' }}>Espace Délégué - Soumission d'une Demande Libre</h3>
          <form onSubmit={handleCreateDemandeDelegue} style={{ display: 'flex', flexDirection: 'column', gap: '15px', maxWidth: '500px' }}>
            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>ID de l'étudiant concerné (laisser vide ou indiquer l'ID) :</label>
              <input
                type="number"
                value={delegueCibleEtudiant}
                onChange={(e) => setDelegueCibleEtudiant(e.target.value)}
                placeholder={`Ex: ${user.id_etudiant}`}
                style={{ width: '100%', padding: '8px' }}
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Type de demande :</label>
              <select
                value={delegueIdType}
                onChange={(e) => setDelegueIdType(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              >
                {typesDemandes.map((type) => (
                  <option key={type.id_type} value={type.id_type}>
                    {type.nom_type || type.libelle_type || type.libelle || `Document N°${type.id_type}`}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Motif (Demande libre / Spéciale) :</label>
              <textarea
                value={delegueMotif}
                onChange={(e) => setDelegueMotif(e.target.value)}
                rows="4"
                style={{ width: '100%', padding: '8px' }}
                placeholder="Motif particulier validé en tant que délégué..."
                required
              />
            </div>

            <div>
              <label style={{ display: 'block', marginBottom: '5px' }}>Nombre d'exemplaires :</label>
              <input
                type="number"
                min="1"
                value={delegueExemplaires}
                onChange={(e) => setDelegueExemplaires(e.target.value)}
                style={{ width: '100%', padding: '8px' }}
                required
              />
            </div>

            <button type="submit" style={{ padding: '10px', background: '#28a745', color: '#fff', border: 'none', cursor: 'pointer' }}>
              Soumettre en tant que Délégué
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default StudentDashboard;