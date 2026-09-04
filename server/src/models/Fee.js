import mongoose from 'mongoose';
import softDeletePlugin from '../middleware/softDeletePlugin.js'; // Adjust path if needed
import auditPlugin from '../middleware/auditPlugin.js'; // Import audit plugin

const feeSchema = new mongoose.Schema({
    // ... existing fee schema fields ...
    studentId: { type: mongoose.Schema.Types.ObjectId, ref: 'Student', required: true },
    academicSessionId: { type: mongoose.Schema.Types.ObjectId, ref: 'AcademicSession', required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch', required: true },
    classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class', required: true },
    month: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    amountPaid: { type: Number, default: 0 },
    status: { type: String, enum: ['Paid', 'Partial', 'Pending'], default: 'Pending' },
    payments: [{
        amount: { type: Number, required: true },
        date: { type: Date, default: Date.now },
        recordedBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }
    }]
});

feeSchema.index({ studentId: 1, month: 1 }, { unique: true });
feeSchema.plugin(softDeletePlugin);

// Apply audit plugin. 
// We will pass the user dynamically from the controller via $locals
feeSchema.plugin(auditPlugin);

export default mongoose.model('Fee', feeSchema);