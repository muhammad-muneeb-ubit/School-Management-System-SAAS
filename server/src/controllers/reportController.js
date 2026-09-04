import Fee from '../models/Fee.js';
import Attendance from '../models/Attendance.js';
import ExamResult from '../models/ExamResult.js';
import Student from '../models/Student.js';
import Exam from '../models/Exam.js';
import mongoose from 'mongoose';
import User from '../models/User.js';

// @desc    Get list of students who haven't fully paid for a specific month
// @route   GET /api/reports/fee-defaulters?month=2024-08
export const getFeeDefaulters = async (req, res, next) => {
    try {
        const { month } = req.query;
        if (!month) return res.status(400).json({ error: 'Please provide a month (YYYY-MM)' });

        const defaulters = await Fee.find({
            branchId: req.user.branchId,
            month: month,
            status: { $in: ['Pending', 'Partial'] }
        })
        .populate({
            path: 'studentId',
            select: 'firstName lastName rollNumber classId',
            populate: { path: 'classId', select: 'name' }
        })
        .select('totalAmount amountPaid status month studentId');

        res.json({ month, count: defaulters.length, defaulters });
    } catch (error) {
        next(error);
    }
};

// @desc    Get attendance summary for a specific class
// @route   GET /api/reports/attendance-summary?classId=
export const getClassAttendanceSummary = async (req, res, next) => {
    try {
        const { classId } = req.query;
        if (!classId) return res.status(400).json({ error: 'Please provide a classId' });

        // We use an aggregation pipeline to unwind the records array and count statuses
        const summary = await Attendance.aggregate([
            { $match: { branchId: req.user.branchId, classId: mongoose.Types.ObjectId(classId) } },
            { $unwind: "$records" },
            { 
                $group: {
                    _id: "$records.studentId",
                    totalDays: { $sum: 1 },
                    presentDays: { 
                        $sum: { $cond: [{ $eq: ["$records.status", "Present"] }, 1, 0] } 
                    }
                }
            },
            {
                $project: {
                    totalDays: 1,
                    presentDays: 1,
                    attendancePercentage: {
                        $multiply: [{ $divide: ["$presentDays", "$totalDays"] }, 100]
                    }
                }
            }
        ]);

        // Populate student names
        await Student.populate(summary, { path: '_id', select: 'firstName lastName rollNumber' });

        res.json(summary);
    } catch (error) {
        next(error);
    }
};

// @desc    Get a 360-degree summary of a student (For Parent/Principal Dashboard)
// @route   GET /api/reports/student-summary/:studentId
export const getStudentSummary = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // If Parent, verify child ownership
        if (req.user.role === 'Parent' && !req.user.children.includes(studentId)) {
            return res.status(403).json({ error: 'Not authorized to view this student.' });
        }

        // 1. Get Student Profile & Class
        const student = await Student.findById(studentId)
            .populate('classId', 'name')
            .populate('sectionId', 'name');

        if (!student) return res.status(404).json({ error: 'Student not found' });

        // 2. Get Attendance Percentage
        const attendanceData = await Attendance.aggregate([
            { $match: { branchId: req.user.branchId, 'records.studentId': new mongoose.Types.ObjectId(studentId) } },
            { $unwind: "$records" },
            { $match: { "records.studentId": new mongoose.Types.ObjectId(studentId) } },
            { 
                $group: {
                    _id: null,
                    totalDays: { $sum: 1 },
                    presentDays: { $sum: { $cond: [{ $eq: ["$records.status", "Present"] }, 1, 0] } }
                }
            }
        ]);
        
        const attendancePercentage = attendanceData.length > 0 
            ? Math.round((attendanceData[0].presentDays / attendanceData[0].totalDays) * 100) 
            : 0;

        // 3. Get Latest Result
        const latestResult = await ExamResult.findOne({ studentId })
            .sort({ createdAt: -1 })
            .populate('examId', 'name')
            .populate('marks.subjectId', 'name');

        // 4. Get Latest Fee Status
        const latestFee = await Fee.findOne({ studentId }).sort({ month: -1 }).select('month totalAmount amountPaid status');

        res.json({
            student,
            attendance: {
                totalDays: attendanceData[0]?.totalDays || 0,
                presentDays: attendanceData[0]?.presentDays || 0,
                percentage: attendancePercentage
            },
            latestResult: latestResult || null,
            latestFee: latestFee || null
        });
    } catch (error) {
        next(error);
    }
};

export const getClassRanking = async (req, res, next) => {
    try {
        const { examId, classId } = req.query;

        // Find all published results for this exam, sort by highest marks
        const results = await ExamResult.find({ examId, status: 'Published', classId })
            .populate('studentId', 'firstName lastName rollNumber')
            .sort({ totalObtained: -1 });

        // Assign Ranks
        const rankedResults = results.map((result, index) => {
            let category = 'Standard';
            let template = 'standard_template'; // Frontend will use this to choose design
            
            if (index < 3) {
                category = 'Position Holder';
                template = 'position_template';
            } else if (index < 10) {
                category = 'Top 10';
                template = 'top10_template';
            }

            return {
                rank: index + 1,
                student: result.studentId,
                totalObtained: result.totalObtained,
                percentage: result.percentage,
                grade: result.grade,
                category,
                template
            };
        });

        res.json(rankedResults);
    } catch (error) {
        next(error);
    }
};


// @desc    Get dashboard stats for Principal
// @route   GET /api/reports/dashboard-stats
export const getDashboardStats = async (req, res, next) => {
    try {
        const branchId = req.user.branchId;
        const currentMonth = new Date().toISOString().slice(0, 7); // "2024-08"

        // 1. Count Students & Teachers
        const totalStudents = await Student.countDocuments({ branchId, status: 'Active' });
        const totalTeachers = await User.countDocuments({ branchId, role: 'Teacher' });

        // 2. Fee Stats for Current Month
        const feeStats = await Fee.aggregate([
            { $match: { branchId: new mongoose.Types.ObjectId(branchId), month: currentMonth } },
            { 
                $group: {
                    _id: null,
                    totalCollected: { $sum: "$amountPaid" },
                    totalPending: { $sum: { $subtract: ["$totalAmount", "$amountPaid"] } }
                }
            }
        ]);

        const collected = feeStats.length > 0 ? feeStats[0].totalCollected : 0;
        const pending = feeStats.length > 0 ? feeStats[0].totalPending : 0;

        // 3. Attendance Stats for the LATEST marked day
        let presentToday = 0;
        let absentToday = 0;

        // Find the most recent date attendance was marked
        const latestAttendance = await Attendance.findOne({ branchId: new mongoose.Types.ObjectId(branchId) }).sort({ date: -1 });

        if (latestAttendance) {
            const latestDate = latestAttendance.date;
            const attendanceAgg = await Attendance.aggregate([
                { $match: { branchId: new mongoose.Types.ObjectId(branchId), date: latestDate } },
                { $unwind: "$records" },
                { $group: { _id: "$records.status", count: { $sum: 1 } } }
            ]);
            
            presentToday = attendanceAgg.find(a => a._id === 'Present')?.count || 0;
            absentToday = attendanceAgg.find(a => a._id === 'Absent')?.count || 0;
        }

        res.json({
            totalStudents,
            totalTeachers,
            collected,
            pending,
            presentToday,
            absentToday
        });

    } catch (error) {
        next(error);
    }
};