// routes/farmRoutes.js

const express = require('express');
const {
  createFarm,
  getMyFarms,
  updateFarm,
  deleteFarm,
  getAllFarms,
} = require('../controllers/farmController');
const { protect, admin, authorizeRoles } = require('../middlewares/authMiddleware');

const router = express.Router();

// Créer une nouvelle ferme
router.post('/', protect, createFarm);

// Route pour les éleveurs et admins : voir leurs propres fermes
router.get('/', protect, authorizeRoles('elevateur', 'admin'), getMyFarms);

// Mettre à jour une ferme
router.put('/:id', protect, updateFarm);

// Supprimer une ferme
router.delete('/:id', protect, deleteFarm);

// Obtenir toutes les fermes
router.get('/all', protect, admin, getAllFarms);



module.exports = router;
