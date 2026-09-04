import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const classSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Grade 5"
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true }
});

classSchema.plugin(softDeletePlugin);
export default mongoose.model('Class', classSchema);