// backend/routes/authRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Route POST /api/auth/login
router.post('/login', async (req, res) => {
    const { email, mot_de_passe } = req.body;

    if (!email || !mot_de_passe) {
        return res.status(400).json({ error: 'Email et mot de passe requis.' });
    }

    try {
        // Rechercher l'utilisateur dans la table UTILISATEUR
        const userQuery = 'SELECT * FROM UTILISATEUR WHERE email = $1';
        const userResult = await pool.query(userQuery, [email]);

        if (userResult.rows.length === 0) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        const user = userResult.rows[0];

        // Vérification du mot de passe haché avec bcrypt
        const isMatch = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
        if (!isMatch) {
            return res.status(401).json({ error: 'Email ou mot de passe incorrect.' });
        }

        // Déterminer le rôle de base
        let role = user.type_utilisateur ? user.type_utilisateur.toLowerCase() : 'etudiant';

        // Si le rôle de base est étudiant, vérifier s'il est aussi dans la table DELEGUE
        if (role === 'etudiant') {
            const delegueCheck = await pool.query('SELECT * FROM DELEGUE WHERE id_utilisateur = $1', [user.id_utilisateur]);
            if (delegueCheck.rows.length > 0) {
                role = 'delegue';
            }
        }

        // Générer le token JWT (assurez-vous d'avoir JWT_SECRET dans votre .env)
        const token = jwt.sign(
            { 
                id_utilisateur: user.id_utilisateur, 
                email: user.email, 
                role 
            },
            process.env.JWT_SECRET || 'secret_jwt_emit_2026',
            { expiresIn: '8h' }
        );

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
        console.error('Erreur lors de la connexion :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

module.exports = router;