import User from '../models/User.js';
import crypto from 'crypto';


// @desc    Principal creates a new Teacher account
// @route   POST /api/teachers
export const createTeacher = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;

        const teacherExists = await User.findOne({ email });
        if (teacherExists) {
            return res.status(400).json({ error: 'Teacher with this email already exists' });
        }

        const teacher = await User.create({
            email,
            password,
            role: 'Teacher',
            branchId: req.user.branchId,
            profile: {
                firstName: firstName || '',
                lastName: lastName || '',
                phone: phone || ''
            }
        });

        res.status(201).json({ message: 'Teacher created successfully', teacher });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal assigns classes/sections/subjects to a teacher
// @route   PUT /api/teachers/:id/assign
export const assignTeacher = async (req, res, next) => {
    try {
        const { classId, sectionId, subjectId } = req.body; 
        const teacher = await User.findById(req.params.id);

        if (!teacher || teacher.role !== 'Teacher') {
            return res.status(404).json({ error: 'Teacher not found' });
        }

        // Check if assignment already exists to prevent duplicates
        const exists = teacher.assignments.find(a => 
            a.classId?.toString() === classId && 
            a.sectionId?.toString() === sectionId && 
            a.subjectId?.toString() === subjectId
        );

        if (!exists) {
            teacher.assignments.push({ classId, sectionId, subjectId });
            await teacher.save();
        }

        res.json({ message: 'Assignment added successfully', assignments: teacher.assignments });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal gets all teachers in their branch
// @route   GET /api/teachers
export const getTeachers = async (req, res, next) => {
    try {
        const teachers = await User.find({ role: 'Teacher', branchId: req.user.branchId })
            .select('-password')
            .populate('assignments.classId', 'name')
            .populate('assignments.sectionId', 'name')
            .populate('assignments.subjectId', 'name code');
            
        res.json(teachers);
    } catch (error) {
        next(error);
    }
};

// @desc    Teacher fetches their own assignments
// @route   GET /api/teachers/my-assignments
export const getMyAssignments = async (req, res, next) => {
    try {
        const teacher = await User.findById(req.user._id)
            .select('assignments')
            .populate('assignments.classId', 'name')
            .populate('assignments.sectionId', 'name')
            .populate('assignments.subjectId', 'name code');

        res.json(teacher.assignments);
    } catch (error) {
        next(error);
    }
};

// @desc    Principal resets password for a Teacher/Parent
// @route   PUT /api/users/:id/reset-password
export const resetUserPassword = async (req, res, next) => {
    try {
        const user = await User.findById(req.params.id);
        if (!user) return res.status(404).json({ error: 'User not found' });

        // Generate a random 8-character password
        const tempPassword = crypto.randomBytes(4).toString('hex');
        user.password = tempPassword; // Mongoose will hash this automatically via pre('save')
        await user.save();

        // In a real app, you'd email this. For MVP, we return it to the Principal.
        res.json({ message: 'Password reset successfully', tempPassword });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal deactivates a teacher (Soft Delete)
// @route   DELETE /api/teachers/:id
export const deleteTeacher = async (req, res, next) => {
    try {
        const teacher = await User.findById(req.params.id);
        if (!teacher || teacher.role !== 'Teacher') {
            return res.status(404).json({ error: 'Teacher not found' });
        }
        
        // This uses our 90-day soft delete plugin!
        await teacher.softDelete(); 
        res.json({ message: 'Teacher deactivated successfully' });
    } catch (error) {
        next(error);
    }
};