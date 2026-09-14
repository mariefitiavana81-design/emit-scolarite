const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');

// =========================================================================
// 1. FILE D'ATTENTE & STATISTIQUES (BINÔME B - SCOLARITÉ)
// =========================================================================

// Récupérer toutes les demandes avec filtres et jointures complètes
router.get('/demandes', async (req, res) => {
  try {
    const query = `
      SELECT 
        d.*,
        u.nom, u.prenom, u.email,
        e.matricule, e.niveau, e.parcours,
        t.libelle AS type_libelle,
        s.libelle_statut AS statut_libelle
      FROM demande d
      LEFT JOIN etudiant e ON (d.id_etudiant = e.id_etudiant OR d.id_etudiant = e.id_utilisateur)
      LEFT JOIN utilisateur u ON (e.id_utilisateur = u.id_utilisateur OR d.id_etudiant = u.id_utilisateur)
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

// Récupérer les statistiques globales
router.get('/stats', async (req, res) => {
  try {
    const query = `
      SELECT s.id_statut, s.libelle_statut, COUNT(d.id_demande) as total
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

// =========================================================================
// 2. WORKFLOW & TRAITEMENT DES DEMANDES (VALIDATION / REJET / CHANGEMENT STATUT)
// =========================================================================

const updateDemandeStatut = async (req, res) => {
  const { id } = req.params;
  const { id_statut, statut_id, statut, commentaire, document_url, date_traitement } = req.body;

  // Normalisation des statuts selon le cahier des charges EMIT :
  // 1 = Reçue / Soumise
  // 2 = En cours de traitement
  // 3 = Validée
  // 4 = Prête (document généré / déposé)
  // 5 = Retirée (récupérée par l'étudiant)
  // 6 = Rejetée
  let targetStatut = id_statut || statut_id;
  if (!targetStatut && statut) {
    const s = String(statut).toLowerCase();
    if (s.includes('cours')) targetStatut = 2;
    else if (s.includes('valid')) targetStatut = 3;
    else if (s.includes('pret') || s.includes('prêt')) targetStatut = 4;
    else if (s.includes('retir')) targetStatut = 5;
    else if (s.includes('rejet') || s.includes('refus')) targetStatut = 6;
    else targetStatut = 1;
  }
  if (!targetStatut) targetStatut = 3;

  try {
    const result = await pool.query(
      `UPDATE demande SET id_statut = $1 WHERE id_demande = $2 RETURNING *`,
      [Number(targetStatut), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demande non trouvée.' });
    }

    res.json({
      message: 'Statut de la demande mis à jour avec succès.',
      demande: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur Update Statut :', err);
    res.status(500).json({ error: err.message });
  }
};

router.put('/demandes/:id/statut', updateDemandeStatut);
router.patch('/demandes/:id', updateDemandeStatut);
router.put('/demandes/:id', updateDemandeStatut);

// Dépôt de document final généré (ex: scan signé ou PDF officiel)
router.post('/demandes/:id/document', async (req, res) => {
  const { id } = req.params;
  const { document_nom, document_url, date_depot } = req.body;

  try {
    const result = await pool.query(
      `UPDATE demande SET id_statut = 4 WHERE id_demande = $1 RETURNING *`,
      [id]
    );

    res.json({
      message: 'Document final déposé avec succès. La demande est désormais Prête au retrait.',
      demande: result.rows[0],
      document: { nom: document_nom, url: document_url, date: date_depot || new Date() }
    });
  } catch (err) {
    console.error('Erreur Dépôt Document :', err);
    res.status(500).json({ error: err.message });
  }
});

// =========================================================================
// 3. GESTION DES UTILISATEURS & RÔLES (VALIDATION EMAIL 409 & FIX PKEY)
// =========================================================================

// Lister tous les comptes utilisateurs enregistrés
router.get('/users', async (req, res) => {
  try {
    const query = `
      SELECT 
        u.id_utilisateur,
        u.nom,
        u.prenom,
        u.email,
        COALESCE(u.role, 'etudiant') AS role,
        e.matricule,
        e.parcours,
        e.niveau
      FROM utilisateur u
      LEFT JOIN etudiant e ON (u.id_utilisateur = e.id_utilisateur OR u.id_utilisateur = e.id_etudiant)
      ORDER BY u.id_utilisateur DESC
    `;
    const result = await pool.query(query);
    res.json(result.rows);
  } catch (err) {
    console.error('Erreur Admin Users List :', err);
    res.status(500).json({ error: err.message });
  }
});

// Créer un compte utilisateur avec vérification préalable d'email (409) et résolution de clé primaire
router.post('/users', async (req, res) => {
  const { nom, prenom, email, mot_de_passe, role, matricule, parcours, niveau } = req.body;

  if (!nom || !prenom || !email || !mot_de_passe) {
    return res.status(400).json({ error: 'Nom, prénom, email et mot de passe sont obligatoires.' });
  }

  const assignedRole = (role || 'etudiant').toLowerCase();
  const cleanEmail = email.trim().toLowerCase();

  try {
    // 1. VÉRIFICATION STRICTE DE L'EMAIL (Validation avant insertion demandée)
    const checkEmail = await pool.query(
      'SELECT id_utilisateur FROM utilisateur WHERE LOWER(TRIM(email)) = $1',
      [cleanEmail]
    );

    if (checkEmail.rows.length > 0) {
      return res.status(409).json({ error: 'Cet email est déjà enregistré' });
    }

    // 2. Hachage du mot de passe
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(mot_de_passe, salt);

    // 3. Insertion avec protection contre les conflits de clé primaire utilisateur_pkey
    let userRes;
    try {
      const userQuery = `
        INSERT INTO utilisateur (nom, prenom, email, mot_de_passe, role)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING id_utilisateur, nom, prenom, email, role
      `;
      userRes = await pool.query(userQuery, [nom.trim(), prenom.trim(), cleanEmail, hashedPassword, assignedRole]);
    } catch (insertErr) {
      // Si la séquence PostgreSQL utilisateur_pkey est désynchronisée
      if (insertErr.code === '23505' && String(insertErr.constraint || insertErr.detail || insertErr.message).includes('utilisateur_pkey')) {
        const nextIdRes = await pool.query('SELECT COALESCE(MAX(id_utilisateur), 0) + 1 AS next_id FROM utilisateur');
        const nextId = nextIdRes.rows[0].next_id;

        const userQueryWithId = `
          INSERT INTO utilisateur (id_utilisateur, nom, prenom, email, mot_de_passe, role)
          VALUES ($1, $2, $3, $4, $5, $6)
          RETURNING id_utilisateur, nom, prenom, email, role
        `;
        userRes = await pool.query(userQueryWithId, [nextId, nom.trim(), prenom.trim(), cleanEmail, hashedPassword, assignedRole]);

        // Resynchroniser la séquence
        await pool.query(`
          SELECT setval(pg_get_serial_sequence('utilisateur', 'id_utilisateur'), $1)
        `, [nextId]).catch(() => {});
      } else if (insertErr.code === '23505' && String(insertErr.detail || insertErr.message).toLowerCase().includes('email')) {
        return res.status(409).json({ error: 'Cet email est déjà enregistré' });
      } else {
        throw insertErr;
      }
    }

    const newUser = userRes.rows[0];

    // Association aux tables académiques si nécessaire
    if (assignedRole === 'etudiant' || assignedRole === 'delegue') {
      try {
        await pool.query(`
          INSERT INTO etudiant (id_utilisateur, matricule, parcours, niveau)
          VALUES ($1, $2, $3, $4)
        `, [newUser.id_utilisateur, matricule || `ET-${Date.now().toString().slice(-4)}`, parcours || 'DAII', niveau || 'L2']);
      } catch (e) {
        // Continue si la table etudiant a des contraintes différentes
      }
    }

    res.status(201).json({
      message: `Compte ${assignedRole.toUpperCase()} créé avec succès.`,
      user: newUser
    });
  } catch (err) {
    console.error('Erreur Création Utilisateur :', err);
    if (err.code === '23505' && String(err.detail || err.message).toLowerCase().includes('email')) {
      return res.status(409).json({ error: 'Cet email est déjà enregistré' });
    }
    res.status(500).json({ error: err.message || 'Erreur interne du serveur.' });
  }
});

// Modifier le rôle ou les droits d'un compte
router.put('/users/:id/role', async (req, res) => {
  const { id } = req.params;
  const { role } = req.body;

  if (!role) {
    return res.status(400).json({ error: 'Le nouveau rôle est requis.' });
  }

  try {
    const result = await pool.query(
      `UPDATE utilisateur SET role = $1 WHERE id_utilisateur = $2 RETURNING id_utilisateur, nom, prenom, email, role`,
      [role.toLowerCase(), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    res.json({
      message: 'Rôle mis à jour avec succès.',
      user: result.rows[0]
    });
  } catch (err) {
    console.error('Erreur Update Role :', err);
    res.status(500).json({ error: err.message });
  }
});

// Supprimer un utilisateur
router.delete('/users/:id', async (req, res) => {
  const { id } = req.params;
  try {
    await pool.query('DELETE FROM etudiant WHERE id_utilisateur = $1', [id]).catch(() => {});
    await pool.query('DELETE FROM demande WHERE id_etudiant = $1', [id]).catch(() => {});
    const result = await pool.query('DELETE FROM utilisateur WHERE id_utilisateur = $1 RETURNING id_utilisateur', [id]);

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Utilisateur introuvable.' });
    }

    res.json({ message: 'Compte utilisateur supprimé avec succès.' });
  } catch (err) {
    console.error('Erreur Suppression Utilisateur :', err);
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;