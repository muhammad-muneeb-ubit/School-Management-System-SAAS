import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const attendanceSchema = new mongoose.Schema({
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    date: { type: Date, required: true }, // The specific day
    
    // Array of student attendance records
    records: [{
        studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
        status: { type: String, enum: ['Present', 'Absent', 'Leave'], default: 'Present' }
    }],
    
    markedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
});

// Prevent multiple attendance documents for the same class/section/date
attendanceSchema.index({ classId: 1, sectionId: 1, date: 1 }, { unique: true });

attendanceSchema.plugin(softDeletePlugin);
export default mongoose.model('Attendance', attendanceSchema);