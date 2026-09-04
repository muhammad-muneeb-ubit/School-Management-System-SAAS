import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const sectionSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "A"
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    capacity: { type: Number, default: 30 }
});

sectionSchema.plugin(softDeletePlugin);
export default mongoose.model('Section', sectionSchema);