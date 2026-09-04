import mongoose from 'mongoose';

const activityLogSchema = new mongoose.Schema({
    action: { type: String, required: true }, // e.g., 'create', 'update', 'delete'
    entity: { type: String, required: true }, // e.g., 'Student', 'Fee', 'ExamResult'
    entityId: { type: mongoose.Schema.Types.ObjectId },
    performedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    timestamp: { type: Date, default: Date.now },
    changes: { type: Object } // Store the modified document details
});

export default mongoose.model('ActivityLog', activityLogSchema);