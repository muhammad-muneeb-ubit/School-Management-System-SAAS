import PromotionRecommendation from '../models/PromotionRecommendation.js';
import Enrollment from '../models/Enrollment.js';
import AcademicSession from '../models/AcademicSession.js';
import Student from '../models/Student.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Teacher submits promotion recommendation
// @route   POST /api/promotion/recommend
export const submitRecommendation = async (req, res, next) => {
    try {
        const { studentId, classId, recommendation, remarks } = req.body;
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        // Upsert recommendation (Update if exists, create if not)
        const rec = await PromotionRecommendation.findOneAndUpdate(
            { studentId, academicSessionId: currentSession._id },
            { teacherId: req.user._id, classId, recommendation, remarks },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );

        res.status(201).json({ message: 'Recommendation submitted', rec });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal reviews all recommendations for a class
// @route   GET /api/promotion/recommendations?classId=
export const getRecommendations = async (req, res, next) => {
    try {
        const { classId } = req.query;
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.json([]);

        const recs = await PromotionRecommendation.find({ classId, academicSessionId: currentSession._id })
            .populate('studentId', 'firstName lastName rollNumber')
            .populate('teacherId', 'email');

        res.json(recs);
    } catch (error) {
        next(error);
    }
};

// @desc    Principal executes promotion to a NEW session
// @route   POST /api/promotion/execute
export const executePromotion = async (req, res, next) => {
    try {
        const { targetSessionId, promotedToClassId, retainedToClassId } = req.body;
        // promotedToClassId: e.g., Grade 6 (where passing students go)
        // retainedToClassId: e.g., Grade 5 (where failing students stay)

        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        const recommendations = await PromotionRecommendation.find({ academicSessionId: currentSession._id });

        let promotedCount = 0;
        let retainedCount = 0;
        let graduatedCount = 0;

        for (const rec of recommendations) {
            // 1. Mark old enrollment as completed
            await Enrollment.updateMany(
                { studentId: rec.studentId, academicSessionId: currentSession._id, status: 'Active' },
                { status: rec.recommendation === 'Pass' ? 'Promoted' : 'Retained' }
            );

            // 2. Create new enrollment for the NEW session
            for (const rec of recommendations) {
                // 1. Mark old enrollment as completed
                await Enrollment.updateMany(
                    { studentId: rec.studentId, academicSessionId: currentSession._id, status: 'Active' },
                    { status: rec.recommendation === 'Pass' ? 'Promoted' : 'Retained' }
                );

                // 2. Create new enrollment for the NEW session
                if (rec.recommendation === 'Pass') {
                    await Enrollment.create({
                        studentId: rec.studentId,
                        academicSessionId: targetSessionId,
                        branchId: req.user.branchId,
                        classId: promotedToClassId,
                        status: 'Active'
                        // sectionId is omitted intentionally; Principal can assign it later
                    });
                    await Student.findByIdAndUpdate(rec.studentId, { classId: promotedToClassId, academicSessionId: targetSessionId });
                    promotedCount++;
                } else {
                    // Retained: create enrollment in the SAME class for the new session
                    await Enrollment.create({
                        studentId: rec.studentId,
                        academicSessionId: targetSessionId,
                        branchId: req.user.branchId,
                        classId: retainedToClassId,
                        status: 'Active'
                    });
                    await Student.findByIdAndUpdate(rec.studentId, { classId: retainedToClassId, academicSessionId: targetSessionId });
                
                    retainedCount++;
                }
            }
        }

        // Archive the old session and set the new one as current
        await AcademicSession.findByIdAndUpdate(currentSession._id, { status: 'archived' });
        await AcademicSession.findByIdAndUpdate(targetSessionId, { status: 'current' });
        await ActivityLog.create({
            action: 'update',
            entity: 'Promotion',
            entityId: currentSession._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Executed promotion. Promoted: ${promotedCount}, Retained: ${retainedCount}` }
        });
        res.json({
            message: 'Promotion executed successfully',
            stats: { promoted: promotedCount, retained: retainedCount, graduated: graduatedCount }
        });
    } catch (error) {
        next(error);
    }
};