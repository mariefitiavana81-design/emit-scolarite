const express = require('express');
const router = express.Router();
<<<<<<< HEAD
const pool = require('../db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Connexion
router.post('/login', async (req, res) => {
  const { email, password } = req.body;
  try {
    const userResult = await pool.query('SELECT * FROM UTILISATEUR WHERE email = $1', [email]);
    if (userResult.rows.length === 0) {
      return res.status(400).json({ error: 'Utilisateur non trouvé' });
    }

    const user = userResult.rows[0];
    const validPassword = await bcrypt.compare(password, user.mot_de_passe);
    if (!validPassword) {
      return res.status(400).json({ error: 'Mot de passe incorrect' });
    }

    const token = jwt.sign(
      { id: user.id_utilisateur, role: user.role },
      process.env.JWT_SECRET || 'secret_key',
      { expiresIn: '24h' }
    );

    res.json({ token, role: user.role, utilisateur: user });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
=======
const pool = require('../config/db'); // ou '../db' selon l'emplacement de ton fichier db.js
const jwt = require('jsonwebtoken');

// Route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    try {
        // 1. Rechercher l'utilisateur par son email (table en minuscules)
        const userQuery = 'SELECT * FROM utilisateur WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const user = userResult.rows[0];

        // 2. Vérification du mot de passe
        if (mot_de_passe !== user.mot_de_passe) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // 3. Détection dynamique du RÔLE selon les tables associées
        let role = 'etudiant'; // Rôle par défaut

        // Vérifier si c'est un Délégué
        const delegueCheck = await pool.query('SELECT * FROM delegue WHERE id_utilisateur = $1', [user.id_utilisateur]);
        if (delegueCheck.rows.length > 0) {
            role = 'delegue';
        } else {
            // Vérifier si c'est un Admin / Agent Scolarité (si tu as une table administrateur ou agent_scolarite)
            const adminCheck = await pool.query('SELECT * FROM administrateur WHERE id_utilisateur = $1', [user.id_utilisateur]).catch(() => ({ rows: [] }));
            if (adminCheck.rows.length > 0 || user.email.includes('admin') || user.email.includes('agent')) {
                role = 'admin';
            }
        }

        // 4. Générer le token JWT
        const token = jwt.sign(
            { 
                id_utilisateur: user.id_utilisateur, 
                email: user.email, 
                role 
            },
            process.env.JWT_SECRET || 'secret_jwt_emit_2026',
            { expiresIn: '8h' }
        );

        // 5. Réponse envoyée au Frontend
        res.status(200).json({
            message: 'Connexion réussie',
            token,
            role,
            user: {
                id_utilisateur: user.id_utilisateur,
                nom: user.nom,
                prenom: user.prenom,
                email: user.email,
                role
            }
        });

    } catch (error) {
        console.error('ERREUR DETAILLEE LOGIN :', error);
        res.status(500).json({ error: error.message || 'Erreur interne du serveur.' });
    }
>>>>>>> a59c60ff81e29fadbb2f2cc4e813b8988185e970
});

module.exports = router;