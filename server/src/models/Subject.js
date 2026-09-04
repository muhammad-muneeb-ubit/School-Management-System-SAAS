import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js';

const subjectSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Mathematics"
    code: { type: String, required: true }, // e.g., "MTH101"
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true }
});

subjectSchema.plugin(softDeletePlugin);
export default mongoose.model('Subject', subjectSchema);