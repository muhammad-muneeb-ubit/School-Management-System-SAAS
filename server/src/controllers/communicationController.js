import Announcement from '../models/Announcement.js';
import Homework from '../models/Homework.js';
import Student from '../models/Student.js';
import ActivityLog from '../models/ActivityLog.js';
// --- ANNOUNCEMENTS ---

// @desc    Principal posts an announcement
// @route   POST /api/communication/announcements
export const createAnnouncement = async (req, res, next) => {
    try {
        const { title, message, audience, classId } = req.body;

        const announcement = await Announcement.create({
            title,
            message,
            audience,
            classId: audience === 'Class' ? classId : null,
            branchId: req.user.branchId,
            createdBy: req.user._id
        });
        await ActivityLog.create({
            action: 'Create Announcement',
            entity: 'Announcement',
            entityId: announcement._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created announcement: ${title}` }
        });
        res.status(201).json(announcement);
    } catch (error) {
        next(error);
    }
};

// @desc    Get announcements based on role
// @route   GET /api/communication/announcements
export const getAnnouncements = async (req, res, next) => {
    try {
        let filter = { branchId: req.user.branchId };

        // If Student, get School-wide + their specific class announcements
        if (req.user.role === 'Student') {
            const student = await Student.findOne({ _id: req.user._id }); // Assuming Student User ID matches Student profile ID for simplicity
            if (student) {
                filter = {
                    branchId: req.user.branchId,
                    $or: [{ audience: 'School' }, { audience: 'Class', classId: student.classId }]
                };
            }
        }
        // If Parent, get School-wide + their children's class announcements
        else if (req.user.role === 'Parent') {
            const children = await Student.find({ _id: { $in: req.user.children } });
            const classIds = children.map(c => c.classId);
            filter = {
                branchId: req.user.branchId,
                $or: [{ audience: 'School' }, { audience: 'Class', classId: { $in: classIds } }]
            };
        }

        const announcements = await Announcement.find(filter).sort({ createdAt: -1 });
        res.json(announcements);
    } catch (error) {
        next(error);
    }
};

// --- HOMEWORK ---

// @desc    Teacher posts homework
// @route   POST /api/communication/homework
export const createHomework = async (req, res, next) => {
    try {
        const { title, description, dueDate, classId, sectionId, subjectId } = req.body;

        const homework = await Homework.create({
            title,
            description,
            dueDate,
            classId,
            sectionId,
            subjectId,
            branchId: req.user.branchId,
            createdBy: req.user._id
        });
        await ActivityLog.create({
            action: 'Create Homework',
            entity: 'Homework',
            entityId: homework._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created homework: ${title}` }
        });
        res.status(201).json(homework);
    } catch (error) {
        next(error);
    }
};

// @desc    Get homework based on role
// @route   GET /api/communication/homework
export const getHomework = async (req, res, next) => {
    try {
        let filter = { branchId: req.user.branchId };

        if (req.user.role === 'Student') {
            const student = await Student.findOne({ _id: req.user._id });
            if (student) {
                filter.classId = student.classId;
                filter.sectionId = student.sectionId;
            }
        } else if (req.user.role === 'Parent') {
            // For MVP, Parents see homework for all their children's classes
            const children = await Student.find({ _id: { $in: req.user.children } });
            const classIds = children.map(c => c.classId);
            const sectionIds = children.map(c => c.sectionId);

            filter.classId = { $in: classIds };
            filter.sectionId = { $in: sectionIds };
        } else if (req.user.role === 'Teacher') {
            // Teachers see homework they created
            filter.createdBy = req.user._id;
        }

        const homeworks = await Homework.find(filter)
            .populate('classId', 'name')
            .populate('sectionId', 'name')
            .populate('subjectId', 'name')
            .sort({ dueDate: 1 });

        res.json(homeworks);
    } catch (error) {
        next(error);
    }
};