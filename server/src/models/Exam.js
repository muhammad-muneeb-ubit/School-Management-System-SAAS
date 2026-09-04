import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const examSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Mid-Term", "Final"
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    totalMarksPerSubject: { type: Number, default: 100 },
    passingPercentage: { type: Number, default: 40 },
    status: { type: String, enum: ['Draft', 'Published'], default: 'Draft' } // Principal publishes when ready
});

examSchema.plugin(softDeletePlugin);
export default mongoose.model('Exam', examSchema);