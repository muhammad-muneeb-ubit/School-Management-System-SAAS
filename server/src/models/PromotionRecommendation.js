import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const recommendationSchema = new mongoose.Schema({
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    teacherId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    recommendation: { type: String, enum: ['Pass', 'Fail'], required: true },
    remarks: { type: String }
});

recommendationSchema.plugin(softDeletePlugin);
export default mongoose.model('PromotionRecommendation', recommendationSchema);