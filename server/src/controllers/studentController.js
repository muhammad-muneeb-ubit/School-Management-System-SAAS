import Student from '../models/Student.js';
import User from '../models/User.js';
import AcademicSession from '../models/AcademicSession.js';
import ActivityLog from '../models/ActivityLog.js';
// @desc    Admit a new student
// @route   POST /api/students
export const admitStudent = async (req, res) => {
    try {
        const {
            firstName, lastName, rollNumber, gender, dob,
            classId, sectionId,
            parentFirstName, parentLastName, parentEmail, parentPhone
        } = req.body;

        // 1. Find Current Academic Session
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        // 2. Check if Parent exists, if not, create Parent account
        let parent = await User.findOne({ email: parentEmail });
        if (!parent) {
            parent = await User.create({
                email: parentEmail,
                password: 'Parent123!', // Default temp password
                role: 'Parent',
                branchId: req.user.branchId,
                // In a real app, you'd store parentFirstName/Phone in a Profile model or embedded object
            });
        }

        // 3. Create the Student
        const student = await Student.create({
            firstName,
            lastName,
            rollNumber,
            gender,
            dob,
            classId,
            sectionId: sectionId || null, // Section is optional
            parentId: parent._id,
            branchId: req.user.branchId,
            academicSessionId: currentSession._id
        });

        // 4. Add student to Parent's children array
        parent.children.push(student._id);
        await parent.save();
        await ActivityLog.create({
            action: 'create',
            entity: 'Student',
            entityId: student._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Admitted student ${student.firstName} ${student.lastName}` }
        });

        res.status(201).json({
            message: 'Student admitted successfully',
            student,
            parentEmail: parent.email
        });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all students in a specific class/section
// @route   GET /api/students?classId=&sectionId=
export const getStudents = async (req, res) => {
    try {
        const { classId, sectionId } = req.query;
        const filter = { branchId: req.user.branchId };

        if (classId) filter.classId = classId;
        if (sectionId) filter.sectionId = sectionId;

        const students = await Student.find(filter)
            .populate('classId', 'name')
            .populate('sectionId', 'name')
            .populate('parentId', 'email');

        res.json(students);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Parent fetches their own children
// @route   GET /api/students/my-children
export const getMyChildren = async (req, res) => {
    try {
        // req.user is the Parent
        const parent = await User.findById(req.user._id).populate({
            path: 'children',
            populate: [
                { path: 'classId', select: 'name' },
                { path: 'sectionId', select: 'name' }
            ]
        });

        res.json(parent.children);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

export const updateStudentStatus = async (req, res, next) => {
    try {
        const { status } = req.body; // 'Active', 'Left', 'Graduated'
        const student = await Student.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json({ message: 'Student status updated', student });
    } catch (error) {
        next(error);
    }
};
// @desc    Get single student by ID with full details
// @route   GET /api/students/:id
export const getStudentById = async (req, res, next) => {
    try {
        const student = await Student.findById(req.params.id)
            .populate('classId', 'name')
            .populate('sectionId', 'name capacity')
            .populate('parentId', 'email profile');
            
        if (!student) return res.status(404).json({ error: 'Student not found' });
        res.json(student);
    } catch (error) {
        next(error);
    }
};