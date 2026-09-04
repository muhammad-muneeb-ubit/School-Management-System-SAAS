import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const timetableSchema = new mongoose.Schema({
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section', required: true },
    
    // Array of days, each containing an array of periods
    schedule: [{
        day: { type: String, enum: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'], required: true },
        periods: [{
            startTime: { type: String, required: true }, // e.g., "08:00"
            endTime: { type: String, required: true },   // e.g., "08:45"
            subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' },
            teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' }
        }]
    }]
});

timetableSchema.plugin(softDeletePlugin);
export default mongoose.model('Timetable', timetableSchema);