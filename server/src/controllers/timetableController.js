import Timetable from '../models/Timetable.js';
import ActivityLog from '../models/ActivityLog.js';
// @desc    Principal creates/updates timetable for a class/section
// @route   PUT /api/academic/timetable
export const setTimetable = async (req, res, next) => {
    try {
        const { classId, sectionId, schedule } = req.body;

        // Upsert: Update if exists, create if not
        const timetable = await Timetable.findOneAndUpdate(
            { classId, sectionId },
            { schedule, branchId: req.user.branchId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        await ActivityLog.create({
            action: 'update',
            entity: 'Timetable',
            entityId: timetable._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Timetable updated for class/section` }
        });

        res.status(200).json({ message: 'Timetable saved successfully', timetable });
    } catch (error) {
        next(error);
    }
};

// @desc    Get timetable for a class/section
// @route   GET /api/academic/timetable?classId=&sectionId=
export const getTimetable = async (req, res, next) => {
    try {
        const { classId, sectionId } = req.query;

        const timetable = await Timetable.findOne({ classId, sectionId })
            .populate('schedule.periods.subjectId', 'name code')
            .populate('schedule.periods.teacherId', 'profile.firstName profile.lastName');

        res.json(timetable || null);
    } catch (error) {
        next(error);
    }
};

// @desc    Teacher gets their own timetable based on assignments
// @route   GET /api/academic/timetable/my-timetable
export const getMyTimetable = async (req, res, next) => {
    try {
        // Find timetables where the teacher is assigned to a period
        const timetables = await Timetable.find({
            'schedule.periods.teacherId': req.user._id
        })
            .populate('classId', 'name')
            .populate('sectionId', 'name')
            .populate('schedule.periods.subjectId', 'name');

        res.json(timetables);
    } catch (error) {
        next(error);
    }
};