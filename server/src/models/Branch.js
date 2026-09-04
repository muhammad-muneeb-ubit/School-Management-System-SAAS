import mongoose from 'mongoose';

const BranchSchema = new mongoose.Schema({
    name: { type: String, required: true }, // e.g., "Main Campus"
    address: String,
    isDefault: { type: Boolean, default: false }
});

export default mongoose.model('Branch', BranchSchema);