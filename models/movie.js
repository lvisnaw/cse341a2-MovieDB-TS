const mongoose = require('mongoose');

const movieSchema = new mongoose.Schema({
  title: { type: String, required: true },
  genre: { type: [String], required: true }, // Changed to an array of strings
  releaseYear: { type: Number, required: true },
  format: { type: String, required: true },
  director: { type: String, required: true },
  leadActors: { type: [String], required: true },
  personalRating: { type: Number, min: 0, max: 10 },
  description: { type: String } // New field for movie description
});

module.exports = mongoose.model('Movie', movieSchema);
