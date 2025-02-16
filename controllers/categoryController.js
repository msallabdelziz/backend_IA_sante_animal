// controllers/categoryController.js

const asyncHandler = require('express-async-handler');
const mongoose = require('mongoose');
const Category = require('../models/Category');

// 1. Créer une nouvelle catégorie (Admin uniquement)
const createCategory = asyncHandler(async (req, res) => {
  const { name, species } = req.body;

  if (!name) {
    res.status(400);
    throw new Error('Veuillez fournir un nom pour la catégorie.');
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error('Cette catégorie existe déjà.');
  }

  const category = await Category.create({ name, species });
  res.status(201).json(category);
});

// 2. Obtenir toutes les catégories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find({ isActive:{ $ne: false } }); // Exclure les catégories désactivées
  res.status(200).json(categories);
});

// 3. Mettre à jour uniquement le nom d'une catégorie (Admin uniquement)
const updateCategory = asyncHandler(async (req, res) => {
    const { name } = req.body; 
    const category = await Category.findById(req.params.id);
  
    if (!category) {
      res.status(404);
      throw new Error('Catégorie introuvable.');
    }
  
    category.name = name || category.name; // Mise à jour uniquement du `name`
  
    const updatedCategory = await category.save();
    res.status(200).json(updatedCategory);
  });


// 4-1. Désactiver une catégorie au lieu de la supprimer définitivement (Admin uniquement)
const desactivateCategory = asyncHandler(async (req, res) => {
  const category = await Category.findById(req.params.id);

  if (!category) {
    res.status(404);
    throw new Error('Catégorie introuvable.');
  }

  if (!category.isActive) {
    res.status(400);
    throw new Error('Cette catégorie est déjà desactive.');
  }


  category.isActive = false; // Désactivation au lieu de suppression
  await category.save();

  res.status(200).json({ message: 'Catégorie désactivée avec succès.' });
});

//4-2 Réactiver une catégorie désactivée (Admin uniquement)
const reactivateCategory = asyncHandler(async (req, res) => {
    const category = await Category.findById(req.params.id);
  
    if (!category) {
      res.status(404);
      throw new Error('Catégorie introuvable.');
    }
  
    if (category.isActive) {
      res.status(400);
      throw new Error('Cette catégorie est déjà active.');
    }
  
    category.isActive = true; // Réactivation de la catégorie
    await category.save();
  
    res.status(200).json({ message: 'Catégorie réactivée avec succès.', category });
  });


// 5. Ajouter une espèce à une catégorie
const addSpeciesToCategory = asyncHandler(async (req, res) => {
    const { categoryId } = req.params;
    const { species } = req.body;

    // Vérifier si l'ID est un ObjectId valide
    if (!mongoose.Types.ObjectId.isValid(categoryId)) {
        res.status(400);
        throw new Error("ID de catégorie invalide.");
    }

    const category = await Category.findById(categoryId);
    if (!category) {
        res.status(404);
        throw new Error('Catégorie introuvable.');
    }

    if (category.species.includes(species)) {
        res.status(400);
        throw new Error('Cette espèce existe déjà dans cette catégorie.');
    }

    category.species.push(species);
    await category.save();
    res.status(200).json(category);
});


// 6. Modifier une espèce dans une catégorie
const updateSpeciesInCategory = asyncHandler(async (req, res) => {
    const { categoryId, speciesName } = req.params;
    const { newSpecies } = req.body;

    const category = await Category.findById(categoryId);
    if (!category) {
        res.status(404);
        throw new Error('Catégorie introuvable.');
    }

    const speciesIndex = category.species.indexOf(speciesName);
    if (speciesIndex === -1) {
        res.status(404);
        throw new Error('Espèce introuvable.');
    }

    category.species[speciesIndex] = newSpecies;
    await category.save();
    res.status(200).json(category);
});

// 7. Supprimer une espèce d'une catégorie
const deleteSpeciesFromCategory = asyncHandler(async (req, res) => {
    const { categoryId, speciesName } = req.params;

    const category = await Category.findById(categoryId);
    if (!category) {
        res.status(404);
        throw new Error('Catégorie introuvable.');
    }
    
    const speciesIndex = category.species.indexOf(speciesName);
    if (speciesIndex === -1) {
        res.status(404);
        throw new Error('Espèce introuvable.');
        }

    const updatedSpecies = category.species.filter(species => species !== speciesName);
    category.species = updatedSpecies;

    await category.save();
    res.status(200).json(category);
});

module.exports = {  };

// Export des fonctions
module.exports = { 
    createCategory,
    getAllCategories,
    updateCategory,
    desactivateCategory,
    reactivateCategory,
    addSpeciesToCategory,
    updateSpeciesInCategory,
    deleteSpeciesFromCategory 
};
