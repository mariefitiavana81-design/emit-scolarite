import React, { useState } from 'react';

export default function ModalTraitement({ demande, onClose, onSuccess }) {
  // Statut sélectionné : 2 = Validée, 3 = Rejetée (selon tes IDs)
  const [idStatut, setIdStatut] = useState(2); 
  const [commentaire, setCommentaire] = useState('');
  const [loading, setLoading] = useState(false);

  if (!demande) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Motif obligatoire en cas de rejet
    if (Number(idStatut) === 3 && !commentaire.trim()) {
      alert('Veuillez préciser le motif du rejet.');
      return;
    }

    setLoading(true);

    try {
      const response = await fetch(`http://localhost:5000/api/demandes/${demande.id_demande}/statut`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id_statut: Number(idStatut),
          details: { 
            ...demande.details, 
            commentaire_agent: commentaire,
            date_traitement: new Date().toISOString()
          }
        }),
      });

      if (!response.ok) throw new Error('Échec de la mise à jour');

      onSuccess(); // Rafraîchit les données du tableau
      onClose();   // Ferme la fenêtre
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.overlay}>
      <div style={styles.modal}>
        <h3 style={{ marginTop: 0 }}>Traitement - Demande #{demande.id_demande}</h3>
        
        <p><strong>Étudiant :</strong> {demande.nom} {demande.prenom} ({demande.matricule})</p>
        <p><strong>Document :</strong> {demande.type_libelle}</p>
        <p><strong>Motif :</strong> {demande.motif}</p>

        <form onSubmit={handleSubmit} style={styles.form}>
          <label><strong>Décision :</strong></label>
          <select value={idStatut} onChange={(e) => setIdStatut(e.target.value)} style={styles.input}>
            <option value={2}>Valider la demande</option>
            <option value={3}>Rejeter la demande</option>
          </select>

          <label><strong>Commentaire / Motif du rejet :</strong></label>
          <textarea 
            rows="3" 
            placeholder="Saisissez une remarque..."
            value={commentaire}
            onChange={(e) => setCommentaire(e.target.value)}
            style={styles.input}
          />

          <div style={styles.actions}>
            <button type="button" onClick={onClose} style={styles.btnCancel}>Annuler</button>
            <button type="submit" disabled={loading} style={styles.btnSubmit}>
              {loading ? 'Enregistrement...' : 'Confirmer'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const styles = {
  overlay: { position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 },
  modal: { backgroundColor: '#fff', borderRadius: '8px', padding: '20px', width: '450px', maxWidth: '90%' },
  form: { display: 'flex', flexDirection: 'column', gap: '10px', marginTop: '15px' },
  input: { padding: '8px', borderRadius: '4px', border: '1px solid #ccc' },
  actions: { display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '15px' },
  btnCancel: { padding: '8px 14px', background: '#ccc', border: 'none', borderRadius: '4px', cursor: 'pointer' },
  btnSubmit: { padding: '8px 14px', background: '#0284c7', color: '#fff', border: 'none', borderRadius: '4px', cursor: 'pointer' }
};