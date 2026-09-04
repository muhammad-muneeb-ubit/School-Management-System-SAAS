import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const examResultSchema = new mongoose.Schema({
    examId: { type: mongoose.Schema.Types.ObjectId, ref: 'Exam', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    
    // Array of marks entered by different teachers
    marks: [{
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject', required: true },
        obtainedMarks: { type: Number, required: true },
        enteredBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }],
    
    // Computed fields
    totalObtained: { type: Number, default: 0 },
    percentage: { type: Number, default: 0 },
    grade: { type: String, default: 'N/A' },
    
    // Workflow status
    status: { type: String, enum: ['Pending', 'Submitted', 'Published'], default: 'Pending' }
});

examResultSchema.index({ examId: 1, studentId: 1 }, { unique: true }); // One result per student per exam
examResultSchema.plugin(softDeletePlugin);
export default mongoose.model('ExamResult', examResultSchema);