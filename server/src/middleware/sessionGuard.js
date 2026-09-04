import AcademicSession from '../models/AcademicSession.js';

// Prevents modifications if the active session is archived
export const protectArchivedSession = async (req, res, next) => {
    try {
        // If body contains academicSessionId, check it. Otherwise, find current.
        const sessionId = req.body.academicSessionId;
        let session;
        
        if (sessionId) {
            session = await AcademicSession.findById(sessionId);
        } else {
            session = await AcademicSession.findOne({ status: 'current' });
        }

        if (session && session.status === 'archived') {
            return res.status(403).json({ error: 'Cannot modify data in an archived academic session.' });
        }
        next();
    } catch (error) {
        next(error);
    }
};