import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';

const userSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ['Super Admin', 'Principal', 'Teacher', 'Student', 'Parent'], required: true },
    branchId: { type: mongoose.Schema.Types.ObjectId, ref: 'Branch' },
    
    // Added Profile object to store names and phone
    profile: {
        firstName: { type: String, default: '' },
        lastName: { type: String, default: '' },
        phone: { type: String, default: '' }
    },
    
    children: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Student' }],
    assignments: [{
        classId: { type: mongoose.Schema.Types.ObjectId, ref: 'Class' },
        sectionId: { type: mongoose.Schema.Types.ObjectId, ref: 'Section' },
        subjectId: { type: mongoose.Schema.Types.ObjectId, ref: 'Subject' }
    }]
});

userSchema.pre('save', async function() {
    if (!this.isModified('password')) return ;
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
});

userSchema.methods.matchPassword = async function(enteredPassword) {
    return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model('User', userSchema);
export default User;