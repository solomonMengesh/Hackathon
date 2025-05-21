import mongoose from 'mongoose';

const employeeSchema = new mongoose.Schema({
  name: { type: String, required: true },

  email: { type: String, required: true, unique: true },

  gender: { type: String, enum: ['Male', 'Female', 'Other'], required: true },

  employmentType: {
    type: String,
    enum: ['Full-time', 'Part-time'],
    required: true
  },

  position: {
    type: String,
    enum: ['CEO', 'COO', 'CTO', 'CISO', 'Director', 'Dept Lead', 'Normal Employee'],
    required: true
  },

  employmentDate: { type: Date, required: true },

  basicSalary: { type: Number, required: true },

  bankAccountNumber: { type: String, required: true }

}, { timestamps: true });

const Employee = mongoose.model('Employee', employeeSchema);
export default Employee;
