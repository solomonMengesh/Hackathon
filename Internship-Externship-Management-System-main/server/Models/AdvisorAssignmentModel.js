import mongoose from 'mongoose';

const advisorAssignmentSchema = new mongoose.Schema({
  studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  advisorId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },

  studentName: { type: String },
  studentEmail: { type: String },
  companyName: { type: String }, // Missing in your current schema
  studentStatus: { type: String },

  advisorName: { type: String },
  advisorEmail: { type: String },
  advisorstatus: { type: String },

  assignedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  assign: { type: Boolean }, // New field

  startDate: { type: Date },
  endDate: { type: Date },
}, { timestamps: true });

export default mongoose.model('AdvisorAssignment', advisorAssignmentSchema);
