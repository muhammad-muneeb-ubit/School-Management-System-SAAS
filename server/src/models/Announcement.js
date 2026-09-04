import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const announcementSchema = new mongoose.Schema({
    title: { type: String, required: true },
    message: { type: String, required: true },
    audience: { type: String, enum: ['School', 'Class'], required: true }, // School-wide or specific class
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: false }, // Required if audience is 'Class'
    createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
}, { timestamps: true });

announcementSchema.plugin(softDeletePlugin);
export default mongoose.model('Announcement', announcementSchema);