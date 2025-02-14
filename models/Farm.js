// models/Farm.js

const mongoose = require('mongoose');

const farmSchema = mongoose.Schema(
  {
    name: { type: String, required: true }, // Nom de la ferme
    location: { type: String, required: true }, // Localisation de la ferme
    owner: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Propriétaire de la ferme
    categories: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Category' }], // Référence aux catégories existantes
  },
  { timestamps: true } // Date de création et de mise à jour
);

module.exports = mongoose.model('Farm', farmSchema);