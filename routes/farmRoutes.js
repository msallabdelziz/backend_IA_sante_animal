// routes/farmRoutes.js

const express = require('express');
const {
  createFarm,
  getMyFarms,
  updateFarm,
  deleteFarm,
} = require('../controllers/farmController');
const { protect } = require('../middlewares/authMiddleware');

const router = express.Router();

// Créer une nouvelle ferme
router.post('/', protect, createFarm);

// Obtenir toutes les fermes du propriétaire
router.get('/', protect, getMyFarms);

// Mettre à jour une ferme
router.put('/:id', protect, updateFarm);

// Supprimer une ferme
router.delete('/:id', protect, deleteFarm);

module.exports = router;
