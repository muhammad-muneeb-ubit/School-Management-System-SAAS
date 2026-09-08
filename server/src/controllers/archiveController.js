import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import ExamResult from '../models/ExamResult.js';
import AcademicSession from '../models/AcademicSession.js';
import ActivityLog from '../models/ActivityLog.js';


// @desc    Export academic session data (Attendance, Fees, Results) as JSON
// @route   GET /api/archive/export/:sessionId
export const exportSessionData = async (req, res, next) => {
    try {
        const sessionId = req.params.sessionId;
        
        // 1. Fetch the data we want to archive
        const [attendance, fees, results] = await Promise.all([
            Attendance.find({ academicSessionId: sessionId, branchId: req.user.branchId }),
            Fee.find({ academicSessionId: sessionId, branchId: req.user.branchId }),
            ExamResult.find({ branchId: req.user.branchId }).populate({ path: 'examId', match: { academicSessionId: sessionId } })
        ]);

        const filteredResults = results.filter(r => r.examId !== null);

        const archiveData = {
            exportedAt: new Date(),
            academicSessionId: sessionId,
            branchId: req.user.branchId,
            attendance,
            fees,
            examResults: filteredResults
        };

        // 2. Delete the data from the DB FIRST (Before sending the response)
        await Attendance.deleteMany({ academicSessionId: sessionId, branchId: req.user.branchId });
        await Fee.deleteMany({ academicSessionId: sessionId, branchId: req.user.branchId });
        await ExamResult.deleteMany({ _id: { $in: filteredResults.map(r => r._id) } });

        // 3. Send the file download response AFTER deletion is successful
        res.setHeader('Content-Type', 'application/json');
        res.setHeader('Content-Disposition', `attachment; filename=session_archive_${sessionId}.json`);
        res.status(200).json(archiveData);

    } catch (error) {
        next(error);
    }
};

// @desc    Import archived data back into the DB
// @route   POST /api/archive/import
// @desc    Import archived data back into the DB
// @route   POST /api/archive/import
export const importSessionData = async (req, res, next) => {
    try {
        const archive = req.body;

        // Remove _id and __v to prevent duplicate key errors on re-insertion
        const cleanData = (arr) => arr.map(({ _id, __v, ...rest }) => rest);
        await ActivityLog.create({
            action: 'import session data',
            entity: 'Archive',
            entityId: null,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Imported session data for ${archive.academicSessionId}` }
        });

        if (archive.attendance && archive.attendance.length > 0) {
            await Attendance.insertMany(cleanData(archive.attendance), { ordered: false });
        }
        if (archive.fees && archive.fees.length > 0) {
            await Fee.insertMany(cleanData(archive.fees), { ordered: false });
        }
        if (archive.examResults && archive.examResults.length > 0) {
            await ExamResult.insertMany(cleanData(archive.examResults), { ordered: false });
        }

        // FIX: Update the Academic Session status back to 'draft' so it's no longer archived
        if (archive.academicSessionId) {
            await AcademicSession.findByIdAndUpdate(archive.academicSessionId, { status: 'draft' });
        }

        res.status(200).json({ message: 'Archive imported successfully. Session status updated to Draft.' });
    } catch (error) {
        next(error);
    }
};