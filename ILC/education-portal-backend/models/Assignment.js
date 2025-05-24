const assignmentSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String },
  dueDate: { type: Date },
  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'Teacher' },
  assignedTo: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
});

module.exports = mongoose.model('Assignment', assignmentSchema);
