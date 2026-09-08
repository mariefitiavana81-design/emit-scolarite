// backend/routes/studentRoutes.js
const express = require('express');
const router = express.Router();
const pool = require('../config/db'); // Ajustez le chemin vers votre configuration de pool PostgreSQL si nécessaire

// 1. Récupérer la liste des types de demandes disponibles
router.get('/types', async (req, res) => {
    try {
        const query = 'SELECT id_type, libelle, piece_requise, description FROM TYPE_DEMANDE ORDER BY libelle ASC';
        const result = await pool.query(query);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des types de demandes :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// 2. Récupérer toutes les demandes d'un étudiant avec les libellés du statut et du type
router.get('/demandes/:id_etudiant', async (req, res) => {
    const { id_etudiant } = req.params;
    try {
        const query = `
            SELECT 
                d.id_demande, 
                d.date_soumission, 
                d.motif, 
                d.nombre_exemplaires, 
                d.id_etudiant,
                t.libelle AS type_libelle, 
                t.piece_requise,
                s.libelle_statut AS statut_libelle,
                s.ordre AS statut_ordre
            FROM DEMANDE d
            JOIN TYPE_DEMANDE t ON d.id_type = t.id_type
            JOIN STATUT_DEMANDE s ON d.id_statut = s.id_statut
            WHERE d.id_etudiant = $1
            ORDER BY d.date_soumission DESC
        `;
        const result = await pool.query(query, [id_etudiant]);
        res.status(200).json(result.rows);
    } catch (error) {
        console.error('Erreur lors de la récupération des demandes :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// 3. Créer une nouvelle demande (Statut initial = 1 "Soumise")
router.post('/demandes', async (req, res) => {
    const { id_etudiant, id_type, motif, nombre_exemplaires } = req.body;

    if (!id_etudiant || !id_type || !motif || !nombre_exemplaires) {
        return res.status(400).json({ error: 'Tous les champs obligatoires doivent être remplis.' });
    }

    try {
        const insertQuery = `
            INSERT INTO DEMANDE (date_soumission, motif, nombre_exemplaires, id_etudiant, id_type, id_statut)
            VALUES (NOW(), $1, $2, $3, $4, 1)
            RETURNING *
        `;
        const values = [motif, nombre_exemplaires, id_etudiant, id_type];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Demande créée avec succès.',
            demande: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la création de la demande :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

// 4. Soumission d'une demande libre (réservée ou spécifique si le rôle est Délégué)
router.post('/demandes/delegue', async (req, res) => {
    const { id_utilisateur, id_etudiant, id_type, motif, nombre_exemplaires } = req.body;

    if (!id_utilisateur || !id_etudiant || !id_type || !motif || !nombre_exemplaires) {
        return res.status(400).json({ error: 'Tous les champs sont requis.' });
    }

    try {
        // Vérifier si l'utilisateur est bien un délégué
        const delegueCheck = await pool.query('SELECT * FROM DELEGUE WHERE id_utilisateur = $1', [id_utilisateur]);
        if (delegueCheck.rows.length === 0) {
            return res.status(403).json({ error: 'Accès refusé : vous devez être délégué pour effectuer cette action.' });
        }

        const insertQuery = `
            INSERT INTO DEMANDE (date_soumission, motif, nombre_exemplaires, id_etudiant, id_type, id_statut)
            VALUES (NOW(), $1, $2, $3, $4, 1)
            RETURNING *
        `;
        const values = [motif, nombre_exemplaires, id_etudiant, id_type];
        const result = await pool.query(insertQuery, values);

        res.status(201).json({
            message: 'Demande libre de délégué soumise avec succès.',
            demande: result.rows[0]
        });
    } catch (error) {
        console.error('Erreur lors de la soumission de la demande délégué :', error);
        res.status(500).json({ error: 'Erreur interne du serveur.' });
    }
});

module.exports = router;