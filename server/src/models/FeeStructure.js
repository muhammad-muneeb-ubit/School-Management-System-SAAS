import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const feeStructureSchema = new mongoose.Schema({
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    amount: { type: Number, required: true }, // e.g., 5000 (in rupees)
    frequency: { type: String, enum: ['Monthly', 'Quarterly', 'Annual'], default: 'Monthly' }
});

feeStructureSchema.plugin(softDeletePlugin);
export default mongoose.model('FeeStructure', feeStructureSchema);