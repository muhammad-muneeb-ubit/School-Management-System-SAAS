import mongoose from 'mongoose';

const settingSchema = new mongoose.Schema({
    maxBranches: { type: Number, default: 3 },
    schoolName: { type: String, default: 'SMS' },
    theme: {
        primary: { type: String, default: '#2563eb' },
        primaryHover: { type: String, default: '#1d4ed8' },
        primaryLight: { type: String, default: '#eff6ff' },
        primaryDark: { type: String, default: '#1e3a8a' },

        // NEW Secondary Colors
        secondary: { type: String, default: '#64748b' },
        secondaryHover: { type: String, default: '#475569' },
        secondaryLight: { type: String, default: '#f1f5f9' },

        sidebarBg: { type: String, default: '#1e3a8a' },
        sidebarHover: { type: String, default: '#1d4ed8' },
        sidebarActive: { type: String, default: '#172033' }
    }
});

export default mongoose.model('Setting', settingSchema);