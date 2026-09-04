const express = require('express');
const router = express.Router();
const pool = require('../db');

// GET: Récupérer toutes les demandes avec filtres optionnels
router.get('/demandes', async (req, res) => {
  try {
    const { statut, type } = req.query;
    let query = `
      SELECT d.*, u.nom, u.prenom, e.matricule, td.libelle AS type_libelle, sd.libelle_statut 
      FROM DEMANDE d
      JOIN ETUDIANT e ON d.id_etudiant = e.id_utilisateur
      JOIN UTILISATEUR u ON e.id_utilisateur = u.id_utilisateur
      JOIN TYPE_DEMANDE td ON d.id_type = td.id_type
      JOIN STATUT_DEMANDE sd ON d.id_statut = sd.id_statut
    `;
    const params = [];
    if (statut) {
      query += ` WHERE d.id_statut = $1`;
      params.push(statut);
    }
    query += ` ORDER BY d.date_soumission DESC`;
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT: Mettre à jour le statut d'une demande et enregistrer l'historique
router.put('/demandes/:id/statut', async (req, res) => {
  const { id } = req.params;
  const { id_statut, id_agent, commentaire } = req.body;

  try {
    // Récupérer le statut actuel
    const current = await pool.query('SELECT id_statut FROM DEMANDE WHERE id_demande = $1', [id]);
    const ancienStatut = current.rows[0]?.id_statut;

    // Mise à jour de la demande
    await pool.query(
      'UPDATE DEMANDE SET id_statut = $1, id_agent = $2 WHERE id_demande = $3',
      [id_statut, id_agent, id]
    );

    // Insertion dans l'historique
    await pool.query(
      `INSERT INTO HISTORIQUE_DEMANDE (id_demande, id_agent, ancien_statut, nouveau_statut, commentaire)
       VALUES ($1, $2, $3, $4, $5)`,
      [id, id_agent, ancienStatut ? String(ancienStatut) : 'Inconnu', String(id_statut), commentaire || '']
    );

    res.json({ message: 'Statut mis à jour avec succès' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// GET: Statistiques globales pour le Dashboard
router.get('/stats', async (req, res) => {
  try {
    const stats = await pool.query(`
      SELECT sd.libelle_statut, COUNT(d.id_demande) as total
      FROM STATUT_DEMANDE sd
      LEFT JOIN DEMANDE d ON sd.id_statut = d.id_statut
      GROUP BY sd.id_statut, sd.libelle_statut
      ORDER BY sd.ordre
    `);
    res.json(stats.rows);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;