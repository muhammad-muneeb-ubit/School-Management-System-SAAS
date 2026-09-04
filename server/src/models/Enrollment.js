import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const enrollmentSchema = new mongoose.Schema({
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    // Changed to required: false because section might be assigned AFTER promotion
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: false }, 
    status: { type: String, enum: ['Active', 'Promoted', 'Retained', 'Graduated', 'Left'], default: 'Active' }
});

enrollmentSchema.plugin(softDeletePlugin);
export default mongoose.model('Enrollment', enrollmentSchema);