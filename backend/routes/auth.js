const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const pool = require('../db'); // Ton fichier de connexion BDD

router.post('/login', async (req, res) => {
  const { email, mot_de_passe } = req.body;

  try {
    // 1. Recherche de l'utilisateur avec son rôle
    const query = `
      SELECT u.*, r.nom_role 
      FROM utilisateurs u 
      JOIN roles r ON u.id_role = r.id_role 
      WHERE u.email = $1 AND u.is_active = true
    `;
    const result = await pool.query(query, [email]);

    if (result.rows.length === 0) {
      return res.status(404).json({ message: 'Utilisateur non trouvé ou compte désactivé.' });
    }

    const user = result.rows[0];

    // 2. Vérification du mot de passe
    const isPasswordValid = await bcrypt.compare(mot_de_passe, user.mot_de_passe);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Mot de passe incorrect.' });
    }

    // 3. Génération du Token JWT
    const token = jwt.sign(
      { 
        id_utilisateur: user.id_utilisateur, 
        email: user.email, 
        nom_role: user.nom_role 
      },
      process.env.JWT_SECRET || 'secret_key_emit',
      { expiresIn: '8h' }
    );

    // 4. Réponse
    res.json({
      token,
      user: {
        id: user.id_utilisateur,
        nom: user.nom,
        prenom: user.prenom,
        email: user.email,
        role: user.nom_role
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Erreur serveur lors de la connexion.' });
  }
});

module.exports = router;