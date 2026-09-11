const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Connexion à la base de données Neon
const db = require('./config/db'); // ou './db' selon l'emplacement de ton fichier de connexion

// Importation des routes
const authRoutes = require('./routes/authRoutes');
const studentRoutes = require('./routes/studentRoutes');

// Chargement sécurisé des routes Admin
let adminRoutes;
try {
  adminRoutes = require('./routes/adminRoutes');
} catch (error) {
  console.log('Info : routes/adminRoutes non trouvées ou en cours de développement.');
}

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

// Enregistrement des préfixes d'API
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

if (adminRoutes) {
  app.use('/api/admin', adminRoutes);
}

// Route PUT pour mettre à jour le statut d'une demande
app.put('/api/demandes/:id/statut', async (req, res) => {
  const { id } = req.params;
  const { id_statut, details } = req.body;

  try {
    const result = await db.query(
      `UPDATE demande 
       SET id_statut = $1, 
           details = $2, 
           updated_at = CURRENT_TIMESTAMP 
       WHERE id_demande = $3 
       RETURNING *`,
      [id_statut, JSON.stringify(details), id]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Demande non trouvée' });
    }

    res.json({ message: 'Statut mis à jour !', demande: result.rows[0] });
  } catch (error) {
    console.error('Erreur SQL:', error);
    res.status(500).json({ error: 'Erreur lors de la mise à jour' });
  }
});

// Route de test de base
app.get('/', (req, res) => {
  res.send('API EMIT - Gestion Scolarité en cours de fonctionnement');
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
  console.error('Erreur serveur :', err.stack);
  res.status(500).json({ error: 'Erreur interne du serveur.' });
});

// Démarrage du serveur
app.listen(PORT, () => {
  console.log(`🚀 Serveur prêt et démarré sur le port ${PORT}`);
});