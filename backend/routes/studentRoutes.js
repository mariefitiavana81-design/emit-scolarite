const express = require('express');
const router = express.Router();
const pool = require('../config/db');

// 1. Récupérer tous les types de demandes (EF-01)
router.get('/types', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM type_demande');
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur SQL Types :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 2. Récupérer les demandes d'un étudiant (EF-04)
router.get('/demandes/:id_etudiant', async (req, res) => {
  const { id_etudiant } = req.params;
  try {
    const query = `
      SELECT 
        d.*,
        t.libelle AS type_libelle,
        s.libelle_statut AS statut_libelle
      FROM demande d
      LEFT JOIN type_demande t ON d.id_type = t.id_type
      LEFT JOIN statut_demande s ON d.id_statut = s.id_statut
      WHERE d.id_etudiant = $1
      ORDER BY d.date_soumission DESC
    `;
    const result = await pool.query(query, [id_etudiant]);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur SQL Demandes :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 3. Soumettre une demande standard (EF-01 & EF-03 : Statut initial 1 'Soumise')
router.post('/demandes', async (req, res) => {
  const { id_etudiant, id_type, motif, nombre_exemplaires } = req.body;
  try {
    const query = `
      INSERT INTO demande (date_soumission, motif, nombre_exemplaires, id_etudiant, id_type, id_statut)
      VALUES (NOW(), $1, $2, $3, $4, 1)
      RETURNING *
    `;
    const result = await pool.query(query, [
      motif || '',
      nombre_exemplaires || 1,
      id_etudiant,
      id_type
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur SQL Insertion :', err.message);
    res.status(500).json({ error: err.message });
  }
});

// 4. Soumettre une demande libre délégué
router.post('/demandes/delegue', async (req, res) => {
  const { id_utilisateur, id_etudiant, id_type, motif, nombre_exemplaires } = req.body;
  try {
    const studentTarget = id_etudiant || id_utilisateur || 1;
    const typeTarget = id_type || 1;
    const query = `
      INSERT INTO demande (date_soumission, motif, nombre_exemplaires, id_etudiant, id_type, id_statut)
      VALUES (NOW(), $1, $2, $3, $4, 1)
      RETURNING *
    `;
    const result = await pool.query(query, [
      `[Demande Délégué] ${motif || ''}`,
      nombre_exemplaires || 1,
      studentTarget,
      typeTarget
    ]);
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error('Erreur SQL Demande Délégué :', err.message);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;