import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const homeworkSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String, required: true },
    dueDate: { type: Date, required: true },
    
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
    
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Teacher
}, { timestamps: true });

homeworkSchema.plugin(softDeletePlugin);
export default mongoose.model('Homework', homeworkSchema);