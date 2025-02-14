const asyncHandler = require('express-async-handler');
const Category = require('../models/Category');

// 1. Créer une nouvelle catégorie (Admin uniquement)
const createCategory = asyncHandler(async (req, res) => {
  const { name, species } = req.body;

  if (!name) {
    res.status(400);
    throw new Error("Veuillez fournir un nom pour la catégorie.");
  }

  const categoryExists = await Category.findOne({ name });
  if (categoryExists) {
    res.status(400);
    throw new Error("Cette catégorie existe déjà.");
  }

  const category = await Category.create({ name, species });
  res.status(201).json(category);
});

// 2. Obtenir toutes les catégories
const getAllCategories = asyncHandler(async (req, res) => {
  const categories = await Category.find();
  res.status(200).json(categories);
});

module.exports = { createCategory, getAllCategories };
