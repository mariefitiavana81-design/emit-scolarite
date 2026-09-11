const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // ou const db = require('../config/db');

// 1. Obtenir toutes les demandes reçues
router.get('/demandes', async (req, res) => {
  try {
    const query = `
      SELECT 
        d.*,
        u.nom, u.prenom, e.matricule,
        t.libelle AS type_libelle,
        s.libelle_statut AS statut_libelle
      FROM demande d
      LEFT JOIN etudiant e ON d.id_etudiant = e.id_utilisateur
      LEFT JOIN utilisateur u ON e.id_utilisateur = u.id_utilisateur
      LEFT JOIN type_demande t ON d.id_type = t.id_type
      LEFT JOIN statut_demande s ON d.id_statut = s.id_statut
      ORDER BY d.date_soumission DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur Admin Demandes :', err);
    res.status(500).json({ error: err.message });
  }
});

// 2. Obtenir les statistiques par statut
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT s.libelle_statut, COUNT(d.id_demande) as total
      FROM statut_demande s
      LEFT JOIN demande d ON s.id_statut = d.id_statut
      GROUP BY s.id_statut, s.libelle_statut
      ORDER BY s.id_statut ASC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur Admin Stats :', err);
    res.status(500).json({ error: err.message });
  }
});

// 3. Mettre à jour le statut d'une demande (EF-05)
router.put('/demandes/:id/statut', async (req, res) => {
  const { id } = req.params;
  const { id_statut, statut_id, commentaire } = req.body;
  const targetStatut = id_statut || statut_id;

  try {
    const query = `
      UPDATE demande 
      SET id_statut = $1
      WHERE id_demande = $2
      RETURNING *
    `;
    const result = await pool.query(query, [targetStatut, id]);
    res.json(result.rows[0]);
  } catch (err) {
    console.error('Erreur Update Statut :', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;