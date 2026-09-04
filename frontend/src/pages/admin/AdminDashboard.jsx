import React, { useEffect, useState } from 'react';
import axios from 'axios';

export default function AdminDashboard() {
  const [demandes, setDemandes] = useState([]);
  const [stats, setStats] = useState([]);
  const [selectedDemande, setSelectedDemande] = useState(null);
  const [newStatut, setNewStatut] = useState('');
  const [commentaire, setCommentaire] = useState('');

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const resDemandes = await axios.get('http://localhost:5000/api/admin/demandes');
      const resStats = await axios.get('http://localhost:5000/api/admin/stats');
      setDemandes(resDemandes.data);
      setStats(resStats.data);
    } catch (err) {
      console.error(err);
    }
  };

  const handleUpdateStatut = async (e) => {
    e.preventDefault();
    if (!selectedDemande || !newStatut) return;
    try {
      await axios.put(`http://localhost:5000/api/admin/demandes/${selectedDemande.id_demande}/statut`, {
        id_statut: parseInt(newStatut),
        id_agent: 1, // ID temporaire de l'agent connecté
        commentaire
      });
      setSelectedDemande(null);
      setCommentaire('');
      fetchData();
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'sans-serif' }}>
      <h2>Dashboard Service Scolarité & Administration</h2>
      
      {/* Cartes Statistiques */}
      <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
        {stats.map((s, idx) => (
          <div key={idx} style={{ border: '1px solid #ccc', padding: '10px 15px', borderRadius: '8px', background: '#f9f9f9' }}>
            <h4>{s.libelle_statut}</h4>
            <p style={{ fontSize: '20px', fontWeight: 'bold' }}>{s.total}</p>
          </div>
        ))}
      </div>

      {/* Tableau des demandes */}
      <h3>Liste des demandes reçues</h3>
      <table border="1" cellPadding="10" style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: '#eee' }}>
            <th>ID</th>
            <th>Étudiant</th>
            <th>Matricule</th>
            <th>Type</th>
            <th>Date</th>
            <th>Statut</th>
            <th>Action</th>
          </tr>
        </thead>
        <tbody>
          {demandes.map((d) => (
            <tr key={d.id_demande}>
              <td>{d.id_demande}</td>
              <td>{d.nom} {d.prenom}</td>
              <td>{d.matricule}</td>
              <td>{d.type_libelle}</td>
              <td>{new Date(d.date_soumission).toLocaleDateString()}</td>
              <td><strong>{d.libelle_statut}</strong></td>
              <td>
                <button onClick={() => setSelectedDemande(d)}>Traiter</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Modal / Formulaire de traitement */}
      {selectedDemande && (
        <div style={{ marginTop: '20px', padding: '15px', border: '2px solid #007bff', borderRadius: '8px' }}>
          <h4>Traitement de la demande N°{selectedDemande.id_demande} ({selectedDemande.type_libelle})</h4>
          <p><strong>Motif étudiant:</strong> {selectedDemande.motif || 'Aucun'}</p>
          
          <form onSubmit={handleUpdateStatut}>
            <label>Changer le statut : </label>
            <select value={newStatut} onChange={(e) => setNewStatut(e.target.value)} required>
              <option value="">-- Sélectionner --</option>
              <option value="2">En cours de traitement</option>
              <option value="3">Complément requis</option>
              <option value="4">Validée</option>
              <option value="5">Rejetée</option>
              <option value="6">Prête</option>
              <option value="7">Clôturée</option>
            </select>
            <br /><br />
            <textarea
              placeholder="Commentaire / Motif en cas de rejet"
              value={commentaire}
              onChange={(e) => setCommentaire(e.target.value)}
              style={{ width: '100%', height: '60px' }}
            />
            <br /><br />
            <button type="submit" style={{ background: '#28a745', color: '#fff', border: 'none', padding: '8px 15px' }}>Enregistrer</button>
            <button type="button" onClick={() => setSelectedDemande(null)} style={{ marginLeft: '10px' }}>Annuler</button>
          </form>
        </div>
      )}
    </div>
  );
}