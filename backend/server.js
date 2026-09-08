const express = require('express');
const cors = require('cors');
require('dotenv').config();

// Importation de toutes les routes
const authRoutes = require('./routes/authRoutes');
const adminRoutes = require('./routes/adminRoutes');
const studentRoutes = require('./routes/studentRoutes');

const app = express();
app.use(cors());
app.use(express.json());

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
});