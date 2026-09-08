import multer from 'multer';
import csv from 'csv-parser';
import stream from 'stream';
import User from '../models/User.js';
import Student from '../models/Student.js';
import AcademicSession from '../models/AcademicSession.js';
import Class from '../models/Class.js';
import Section from '../models/Section.js';
import ActivityLog from '../models/ActivityLog.js';

const upload = multer({ storage: multer.memoryStorage() });

export const bulkImportStudents = [
    upload.single('file'),
    async (req, res, next) => {
        try {
            if (!req.file) return res.status(400).json({ error: 'Please upload a CSV file' });

            const results = [];
            const bufferStream = new stream.PassThrough();
            bufferStream.end(req.file.buffer);

            bufferStream
                .pipe(csv())
                .on('data', (data) => results.push(data))
                .on('end', async () => {
                    const currentSession = await AcademicSession.findOne({ status: 'current' });
                    if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

                    let successCount = 0;
                    let errorCount = 0;

                    for (const row of results) {
                        try {
                            // 1. Resolve Class and Section by NAME instead of ID
                            const classDoc = await Class.findOne({ name: row.className?.trim(), branchId: req.user.branchId });
                            if (!classDoc) { errorCount++; continue; }

                            const sectionDoc = await Section.findOne({ name: row.sectionName?.trim(), classId: classDoc._id });
                            if (!sectionDoc) { errorCount++; continue; }

                            // 2. Find or Create Parent
                            let parent = await User.findOne({ email: row.parentEmail?.trim() });
                            if (!parent) {
                                parent = await User.create({
                                    email: row.parentEmail,
                                    password: 'Parent123!',
                                    role: 'Parent',
                                    branchId: req.user.branchId,
                                    profile: { firstName: row.parentFirstName || 'Parent', phone: row.parentPhone || '' }
                                });
                            }

                            // 3. Check if student already exists
                            const existingStudent = await Student.findOne({ rollNumber: row.rollNumber, branchId: req.user.branchId });
                            if (existingStudent) { errorCount++; continue; }

                            // 4. Create Student
                            await Student.create({
                                firstName: row.firstName,
                                lastName: row.lastName || '',
                                rollNumber: row.rollNumber,
                                gender: row.gender || 'Male',
                                classId: classDoc._id,
                                sectionId: sectionDoc._id,
                                parentId: parent._id,
                                branchId: req.user.branchId,
                                academicSessionId: currentSession._id
                            });
                            parent.children.push(newStudent._id);
                            await parent.save();
                            successCount++;
                        } catch (err) {
                            errorCount++;
                        }
                    }
                    await ActivityLog.create({
                        action: 'bulk import students',
                        entity: 'BulkImport',
                        entityId: null,
                        performedBy: req.user._id,
                        branchId: req.user.branchId,
                        changes: { message: `Imported students in bulk` }
                    });

                    res.status(200).json({ message: `Import complete. Success: ${successCount}, Failed/Existing: ${errorCount}` });
                });
        } catch (error) {
            next(error);
        }
    }
];