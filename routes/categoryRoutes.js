// routes/categoeyRoutes.js

const express = require('express');
const { createCategory, getAllCategories } = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ajouter une nouvelle catégorie (Admin uniquement)
router.post('/', protect, admin, createCategory);

// Obtenir toutes les catégories
router.get('/', protect, getAllCategories);

module.exports = router;
