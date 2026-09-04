import mongoose from 'mongoose';

const SettingSchema = new mongoose.Schema({
    maxBranches: { type: Number, default: 3 } // Super Admin can change this
});

export default mongoose.model('Setting', SettingSchema);