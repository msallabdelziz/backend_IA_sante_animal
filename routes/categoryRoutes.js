// routes/categoryRoutes.js

const express = require('express');
const {
  createCategory,
  getAllCategories,
  updateCategory,
  deleteCategory,
  addSpeciesToCategory,
  updateSpeciesInCategory,
  deleteSpeciesFromCategory
} = require('../controllers/categoryController');
const { protect, admin } = require('../middlewares/authMiddleware');

const router = express.Router();

// Ajouter une nouvelle catégorie (Admin uniquement)
router.post('/', protect, admin, createCategory);

// Obtenir toutes les catégories
router.get('/', protect, getAllCategories);

// Mettre à jour une catégorie (Admin uniquement)
router.put('/:id', protect, admin, updateCategory);

// Supprimer une catégorie (Admin uniquement)
router.delete('/:id', protect, admin, deleteCategory);

// Ajouter une espèce à une catégorie
router.post('/:categoryId/species', protect, admin, addSpeciesToCategory);

// Modifier une espèce dans une catégorie
router.put('/:categoryId/species/:speciesName', protect, admin, updateSpeciesInCategory);

// Supprimer une espèce d'une catégorie
router.delete('/:categoryId/species/:speciesName', protect, admin, deleteSpeciesFromCategory);


module.exports = router;
