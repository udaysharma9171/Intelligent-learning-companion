const studentSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    performance: {
      subjectScores: [{ subject: String, score: Number }],
    },
    recommendedResources: [String],
  });
  
  module.exports = mongoose.model('Student', studentSchema);
  