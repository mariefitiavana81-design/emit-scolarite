const express = require('express');
const cors = require('cors');
require('dotenv').config();

<<<<<<< HEAD
// Importation de toutes les routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
=======
const authRoutes = require('./routes/authRoutes');
>>>>>>> a59c60ff81e29fadbb2f2cc4e813b8988185e970
const studentRoutes = require('./routes/studentRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middlewares
app.use(cors());
app.use(express.json());

<<<<<<< HEAD
// Enregistrement des préfixes API
app.use('/api/auth', authRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/student', studentRoutes);

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Serveur prêt sur le port ${PORT}`));
// Route PUT pour mettre à jour le statut et le commentaire
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
=======
// Routes de l'API
app.use('/api/auth', authRoutes);
app.use('/api/student', studentRoutes);

// Importation optionnelle des routes Admin (si créées par votre binôme)
try {
    const adminRoutes = require('./routes/adminRoutes');
    app.use('/api/admin', adminRoutes);
} catch (error) {
    console.log('Info : routes admin non encore chargées ou chemin différent.');
}

// Route de test de base
app.get('/', (req, res) => {
    res.send('API EMIT - Gestion Scolarité en cours de fonctionnement');
});

// Gestion globale des erreurs
app.use((err, req, res, next) => {
    console.error('Erreur serveur :', err.stack);
    res.status(500).json({ error: 'Erreur interne du serveur.' });
});

app.listen(PORT, () => {
    console.log(`Serveur démarré sur le port ${PORT}`);
>>>>>>> a59c60ff81e29fadbb2f2cc4e813b8988185e970
});