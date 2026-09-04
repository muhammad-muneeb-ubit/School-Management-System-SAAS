import multer from 'multer';
import { Parser } from 'json2csv';
import User from '../models/User.js';
import Student from '../models/Student.js';
import AcademicSession from '../models/AcademicSession.js';

// Configure Multer to store file in memory (no disk saving needed)
const upload = multer({ storage: multer.memoryStorage() });

// @desc    Upload CSV and bulk import students
// @route   POST /api/students/bulk-import
export const bulkImportStudents = [
    upload.single('file'),
    async (req, res, next) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });

            // Convert CSV buffer to string, then parse
            const csvString = req.file.buffer.toString('utf8');
            const records = parseCsv(csvString); // Simple CSV parser below
            
            const currentSession = await AcademicSession.findOne({ status: 'current' });
            if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

            let successCount = 0;
            let errorCount = 0;

            for (const row of records) {
                try {
                    // Expected CSV columns: firstName, lastName, rollNumber, gender, classId, sectionId, parentEmail
                    let parent = await User.findOne({ email: row.parentEmail });
                    if (!parent) {
                        parent = await User.create({
                            email: row.parentEmail,
                            password: 'Parent123!',
                            role: 'Parent',
                            branchId: req.user.branchId,
                            profile: { firstName: row.parentFirstName || 'Parent', phone: row.parentPhone || '' }
                        });
                    }

                    const existingStudent = await Student.findOne({ rollNumber: row.rollNumber, branchId: req.user.branchId });
                    if (existingStudent) {
                        errorCount++;
                        continue;
                    }

                    const student = await Student.create({
                        firstName: row.firstName,
                        lastName: row.lastName,
                        rollNumber: row.rollNumber,
                        gender: row.gender,
                        classId: row.classId,
                        sectionId: row.sectionId,
                        parentId: parent._id,
                        branchId: req.user.branchId,
                        academicSessionId: currentSession._id
                    });

                    parent.children.push(student._id);
                    await parent.save();
                    successCount++;
                } catch (err) {
                    errorCount++;
                }
            }

            res.status(200).json({ message: `Import complete. Success: ${successCount}, Failed/Existing: ${errorCount}` });
        } catch (error) {
            next(error);
        }
    }
];

// Simple custom CSV parser (avoids needing csv-parser package complexity for standard CSVs)
function parseCsv(csvString) {
    const lines = csvString.trim().split('\n');
    const headers = lines[0].split(',').map(h => h.trim());
    const records = [];
    
    for (let i = 1; i < lines.length; i++) {
        const values = lines[i].split(',').map(v => v.trim());
        if (values.length === headers.length) {
            const row = {};
            headers.forEach((h, idx) => row[h] = values[idx]);
            records.push(row);
        }
    }
    return records;
}