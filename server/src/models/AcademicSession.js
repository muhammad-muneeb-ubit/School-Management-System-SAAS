import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const academicSessionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "2024-2025"
    startDate: { type: Date, required: true },
    endDate: { type: Date, required: true },
    status: { type: String, enum: ['draft', 'current', 'archived'], default: 'draft' }
});

academicSessionSchema.plugin(softDeletePlugin);
export default mongoose.model('AcademicSession', academicSessionSchema);