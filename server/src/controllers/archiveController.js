import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import ExamResult from '../models/ExamResult.js';

// @desc    Export academic session data (Attendance, Fees, Results) as JSON
// @route   GET /api/archive/export/:sessionId
export const exportSessionData = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId;
        
        const [attendance, fees, results] = await Promise.all([
            Attendance.find({ academicSessionId: sessionId, branchId: req.user.branchId }),
            Fee.find({ academicSessionId: sessionId, branchId: req.user.branchId }),
            ExamResult.find({ branchId: req.user.branchId }).populate({ path: 'examId', match: { academicSessionId: sessionId } })
        ]);

        // Filter out results where examId is null (because we matched by session)
        const filteredResults = results.filter(r => r.examId !== null);

        const archiveData = {
            exportedAt: new Date(),
            academicSessionId: sessionId,
            branchId: req.user.branchId,
            attendance,
            fees,
            examResults: filteredResults
        };

        // Set headers to download as file
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=session_archive_${sessionId}.json`);
        res.status(200).json(archiveData);

        // OPTIONAL: Delete the exported data to save DB space
        await Attendance.deleteMany({ academicSessionId: sessionId, branchId: req.user.branchId });
        await Fee.deleteMany({ academicSessionId: sessionId, branchId: req.user.branchId });
        await ExamResult.deleteMany({ _id: { $in: filteredResults.map(r => r._id) } });

    } catch (error) {
        next(error);
    }
};

// @desc    Import archived data back into the DB
// @route   POST /api/archive/import
export const importSessionData = async (req, res, next) => {
    try {
        const archive = req.body;
        
        // Remove _id and __v to prevent duplicate key errors on re-insertion
        const cleanData = (arr) => arr.map(({ _id, __v, ...rest }) => rest);

        if (archive.attendance && archive.attendance.length > 0) {
            await Attendance.insertMany(cleanData(archive.attendance));
        }
        if (archive.fees && archive.fees.length > 0) {
            await Fee.insertMany(cleanData(archive.fees));
        }
        if (archive.examResults && archive.examResults.length > 0) {
            await ExamResult.insertMany(cleanData(archive.examResults));
        }

        res.status(200).json({ message: 'Archive imported successfully' });
    } catch (error) {
        next(error);
    }
};