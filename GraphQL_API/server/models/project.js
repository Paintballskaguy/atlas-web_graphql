const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const projectSchema = new Schema({
  title: { type: String, required: true },
  weight: { type: Number, required: true },
  description: { type: String, required: true }
});

// Create model only if not already defined
module.exports = mongoose.models.Project || mongoose.model('Project', projectSchema);