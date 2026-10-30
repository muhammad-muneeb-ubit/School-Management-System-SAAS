import multer from 'multer';
import csv from 'csv-parser';
import stream from 'stream';
import Timetable from '../models/Timetable.js';
import Class from '../models/Class.js';
import Section from '../models/Section.js';
import Subject from '../models/Subject.js';
import User from '../models/User.js';

const upload = multer({ storage: multer.memoryStorage() });

export const bulkImportTimetable = [
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
                    try {
                        const branchId = req.user.branchId;
                        let successCount = 0;
                        let errorCount = 0;

                        // Group rows by class+section
                        const timetableMap = new Map(); // key: "classId_sectionId"

                        for (const row of results) {
                            try {
                                // 1. Resolve Class by name
                                const classDoc = await Class.findOne({ 
                                    name: row.className?.trim(), 
                                    branchId 
                                });
                                if (!classDoc) { 
                                    console.error(`Class not found: ${row.className}`);
                                    errorCount++; 
                                    continue; 
                                }

                                // 2. Resolve Section by name + classId
                                const sectionDoc = await Section.findOne({ 
                                    name: row.sectionName?.trim(), 
                                    classId: classDoc._id 
                                });
                                if (!sectionDoc) { 
                                    console.error(`Section not found: ${row.sectionName} for class ${row.className}`);
                                    errorCount++; 
                                    continue; 
                                }

                                // 3. Resolve Subject by name + classId
                                const subjectDoc = await Subject.findOne({ 
                                    name: { $regex: new RegExp(`^${row.subjectName?.trim()}$`, 'i') }, 
                                    classId: classDoc._id 
                                });
                                if (!subjectDoc) { 
                                    console.error(`Subject not found: ${row.subjectName} for class ${row.className}`);
                                    errorCount++; 
                                    continue; 
                                }

                                // 4. Resolve Teacher by email
                                const teacherDoc = await User.findOne({ 
                                    email: row.teacherEmail?.trim(),
                                    role: 'Teacher'
                                });
                                if (!teacherDoc) { 
                                    console.error(`Teacher not found: ${row.teacherEmail}`);
                                    errorCount++; 
                                    continue; 
                                }

                                // 5. Validate day
                                const validDays = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
                                const day = row.day?.trim();
                                if (!validDays.includes(day)) {
                                    console.error(`Invalid day: ${day}`);
                                    errorCount++; 
                                    continue; 
                                }

                                // 6. Create period object
                                const period = {
                                    startTime: row.startTime?.trim(),
                                    endTime: row.endTime?.trim(),
                                    subjectId: subjectDoc._id,
                                    teacherId: teacherDoc._id
                                };

                                // 7. Group into timetableMap
                                const key = `${classDoc._id}_${sectionDoc._id}`;
                                if (!timetableMap.has(key)) {
                                    timetableMap.set(key, {
                                        classId: classDoc._id,
                                        sectionId: sectionDoc._id,
                                        schedule: []
                                    });
                                }

                                const tt = timetableMap.get(key);
                                
                                // Find or create the day in schedule
                                let dayObj = tt.schedule.find(d => d.day === day);
                                if (!dayObj) {
                                    dayObj = { day, periods: [] };
                                    tt.schedule.push(dayObj);
                                }
                                
                                dayObj.periods.push(period);
                                successCount++;

                            } catch (err) {
                                console.error('Row error:', err.message);
                                errorCount++;
                            }
                        }

                        // 8. Upsert all timetables
                        let upsertCount = 0;
                        for (const [key, tt] of timetableMap) {
                            await Timetable.findOneAndUpdate(
                                { classId: tt.classId, sectionId: tt.sectionId },
                                { 
                                    classId: tt.classId, 
                                    sectionId: tt.sectionId, 
                                    branchId,
                                    schedule: tt.schedule 
                                },
                                { upsert: true, returnDocument: 'after', setDefaultsOnInsert: true }
                            );
                            upsertCount++;
                        }

                        res.status(200).json({ 
                            message: `Import complete! ${successCount} periods imported across ${upsertCount} timetables. Failed: ${errorCount}` 
                        });

                    } catch (error) {
                        next(error);
                    }
                });
        } catch (error) {
            next(error);
        }
    }
];