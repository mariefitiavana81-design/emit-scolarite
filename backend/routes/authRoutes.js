const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, password, mot_de_passe } = req.body;
    const inputPassword = password || mot_de_passe;

    if (!email || !inputPassword) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    try {
        // 1. Rechercher l'utilisateur par son email
        const userQuery = 'SELECT * FROM utilisateur WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const user = userResult.rows[0];

        // 2. Vérification du mot de passe (compatible bcrypt et texte brut)
        let isValidPassword = false;
        if (user.mot_de_passe.startsWith('$2a$') || user.mot_de_passe.startsWith('$2b$')) {
            isValidPassword = await bcrypt.compare(inputPassword, user.mot_de_passe);
        } else {
            isValidPassword = (inputPassword === user.mot_de_passe);
        }

        if (!isValidPassword) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // 3. Détection dynamique du RÔLE (si colonne rôle absente de utilisateur)
        let role = user.role || 'etudiant';

        if (!user.role) {
            const delegueCheck = await pool.query('SELECT * FROM delegue WHERE id_utilisateur = $1', [user.id_utilisateur]).catch(() => ({ rows: [] }));
            if (delegueCheck.rows.length > 0) {
                role = 'delegue';
            } else {
                const adminCheck = await pool.query('SELECT * FROM administrateur WHERE id_utilisateur = $1', [user.id_utilisateur]).catch(() => ({ rows: [] }));
                if (adminCheck.rows.length > 0 || user.email.includes('admin') || user.email.includes('agent')) {
                    role = 'admin';
                }
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
            { expiresIn: '24h' }
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
});

module.exports = router;