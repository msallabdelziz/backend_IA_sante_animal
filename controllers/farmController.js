// controllers/farmController.js

const asyncHandler = require('express-async-handler');
const Farm = require('../models/Farm');

// 1. Créer une nouvelle ferme (en sélectionnant des catégories existantes)
const createFarm = asyncHandler(async (req, res) => {
  const { name, location, categories } = req.body;

  if (!name || !location || !categories || categories.length === 0) {
    res.status(400);
    throw new Error("Veuillez fournir un nom, une localisation et au moins une catégorie.");
  }

  // Vérifier si toutes les catégories existent
  const existingCategories = await Category.find({ _id: { $in: categories } });
  if (existingCategories.length !== categories.length) {
    res.status(400);
    throw new Error("Une ou plusieurs catégories sélectionnées sont invalides.");
  }

  const farm = await Farm.create({
    name,
    location,
    owner: req.user._id,
    categories,
  });

  res.status(201).json(farm);
});

// 2. Obtenir toutes les fermes du propriétaire connecté
const getMyFarms = asyncHandler(async (req, res) => {
  const farms = await Farm.find({ owner: req.user._id }); // Filtrer par propriétaire
  res.status(200).json(farms);
});


// 3. Mettre à jour une ferme
const updateFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id);

  if (!farm) {
    res.status(404);
    throw new Error('Ferme introuvable.');
  }

  // Vérifier si l'utilisateur connecté est le propriétaire de la ferme
  if (farm.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Accès non autorisé à cette ferme.');
  }

  // Mettre à jour les champs fournis
  const updatedFarm = await Farm.findByIdAndUpdate(req.params.id, req.body, {
    new: true,
    runValidators: true,
  });

  res.status(200).json(updatedFarm);
});

// 4. Supprimer une ferme
const deleteFarm = asyncHandler(async (req, res) => {
  const farm = await Farm.findById(req.params.id);

  if (!farm) {
    res.status(404);
    throw new Error('Ferme introuvable.');
  }

  // Vérifier si l'utilisateur connecté est le propriétaire de la ferme
  if (farm.owner.toString() !== req.user._id.toString()) {
    res.status(401);
    throw new Error('Accès non autorisé à cette ferme.');
  }

  // Supprimer la ferme
  await Farm.findByIdAndDelete(req.params.id);
  res.status(200).json({ message: 'Ferme supprimée avec succès.' });
});

// 5. Obtenir toutes les fermes (pour les admins uniquement)
const getAllFarms = asyncHandler(async (req, res) => {
  // Vérification du rôle de l'utilisateur
  if (req.user.role !== 'admin') {
    res.status(403);
    throw new Error('Accès refusé. Cette ressource est réservée aux administrateurs.');
  }

  // Récupération de toutes les fermes avec les informations des propriétaires
  const farms = await Farm.find().populate('owner', 'firstName lastName email');
  res.status(200).json(farms);
});


// Export des fonctions
module.exports = { createFarm, getMyFarms, updateFarm, deleteFarm, getAllFarms };
