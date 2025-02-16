// models/categorySchema.js

const mongoose = require('mongoose');

const categorySchema = mongoose.Schema(
  {
    name: { type: String, required: true, unique: true }, // Nom unique de la catégorie (ex: Volailles, Bovins)
    species: [{ type: String }], // Espèces dans la catégorie (ex: ["Poulet", "Dinde"])
    isActive: { type: Boolean, default: true }, // Ajout du champ isActive
  },
  { timestamps: true }
);

module.exports = mongoose.model('Category', categorySchema);
