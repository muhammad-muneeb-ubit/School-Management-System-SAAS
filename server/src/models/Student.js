import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const studentSchema = new mongoose.Schema({
    firstName: { type: String, required: true },
    lastName: { type: String, required: false },
    rollNumber: { type: String, required: true },
    gender: { type: String, enum: ['Male', 'Female', 'Other'] },
    dob: { type: Date },
    
    // Academic Linkings
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: false },
    
    // Parent Linking
    parentId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    
    status: { type: String, enum: ['Active', 'Left', 'Graduated'], default: 'Active' }
});

studentSchema.plugin(softDeletePlugin);
export default mongoose.model('Student', studentSchema);