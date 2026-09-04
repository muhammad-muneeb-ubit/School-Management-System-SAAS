import Attendance from '../models/Attendance.js';
import AcademicSession from '../models/AcademicSession.js';
import Student from '../models/Student.js';

// @desc    Teacher marks/updates attendance for a class
// @route   POST /api/attendance
export const markAttendance = async (req, res, next) => {
    try {
        const { classId, sectionId, date, records } = req.body;
        
        // 1. Find Current Academic Session
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        // 2. Upsert Attendance (Create if doesn't exist, Update if it does)
        const attendance = await Attendance.findOneAndUpdate(
            { classId, sectionId, date: new Date(date) }, // Search criteria
            {
                $set: { 
                    records: records, 
                    markedBy: req.user._id,
                    academicSessionId: currentSession._id,
                    branchId: req.user.branchId
                }
            },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(200).json({ message: 'Attendance saved successfully', attendance });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance for a specific class, section, and date
// @route   GET /api/attendance?classId=&sectionId=&date=
export const getAttendanceByDate = async (req, res, next) => {
    try {
        const { classId, sectionId, date } = req.query;
        
        const attendance = await Attendance.findOne({
            classId,
            sectionId,
            date: new Date(date)
        }).populate('records.studentId', 'firstName lastName rollNumber');

        res.json(attendance || null);
    } catch (error) {
        next(error);
    }
};

// @desc    Parent/Student views their own attendance history
// @route   GET /api/attendance/my-history?studentId=
export const getMyAttendanceHistory = async (req, res, next) => {
    try {
        const { studentId } = req.query;

        // If Parent, verify this student belongs to them
        if (req.user.role === 'Parent') {
            if (!req.user.children.includes(studentId)) {
                return res.status(403).json({ error: 'Not authorized to view this student.' });
            }
        }

        // Find all attendance documents where this student exists in the records array
        // Using $elemMatch to project only this specific student's record from the array
        const history = await Attendance.find({
            'records.studentId': studentId,
            branchId: req.user.branchId
        }).select('date records.$');

        res.json(history);
    } catch (error) {
        next(error);
    }
};