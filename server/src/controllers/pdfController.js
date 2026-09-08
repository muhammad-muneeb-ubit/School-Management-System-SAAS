import PDFDocument from 'pdfkit';
import Student from '../models/Student.js';
import Attendance from '../models/Attendance.js';
import Fee from '../models/Fee.js';
import ExamResult from '../models/ExamResult.js';
import Timetable from '../models/Timetable.js';
import User from '../models/User.js';

// Helper to send PDF headers
const startPdf = (res, title) => {
    const doc = new PDFDocument({ size: 'A4', margin: 50 });
    res.setHeader('Content-Type', 'application/pdf');
    res.setHeader('Content-Disposition', `inline; filename="${title}.pdf"`);
    doc.pipe(res);
    doc.fontSize(20).text(title, { align: 'center' });
    doc.moveDown();
    return doc;
};

// 1. Student List PDF
export const downloadStudentList = async (req, res, next) => {
    try {
         const filter = { branchId: req.user.branchId, status: 'Active' };
        if (req.query.classId) filter.classId = req.query.classId;
        if (req.query.sectionId) filter.sectionId = req.query.sectionId;

        const students = await Student.find(filter).sort('rollNumber');
        
        
        const doc = startPdf(res, 'Student List');
        doc.fontSize(12).text(`Total Students: ${students.length}`, { underline: true });
        doc.moveDown(0.5);
        
        students.forEach((s, i) => {
            doc.text(`${i + 1}. ${s.rollNumber} - ${s.firstName} ${s.lastName} (${s.gender})`);
        });
        
        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};

// 2. Attendance Sheet PDF (Monthly Grid)
// 2. Attendance Sheet PDF (Printable grid for a specific date)
export const downloadAttendanceSheet = async (req, res, next) => {
    try {
        const { classId, sectionId, date } = req.query;
        
        // 1. Fetch students first
        const students = await Student.find({ classId, sectionId, status: 'Active' }).sort('rollNumber');
        
        // 2. Fetch the attendance document for that specific date
        const attendanceDoc = await Attendance.findOne({
            classId, 
            sectionId, 
            date: new Date(date)
        });

        // 3. Start PDF
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Attendance_Sheet_${date}.pdf"`);
        doc.pipe(res);
        
        doc.fontSize(20).fillColor('#1f2937').text('Attendance Sheet', { align: 'center' });
        doc.moveDown();
        doc.fontSize(12).fillColor('#666666').text(`Date: ${new Date(date).toLocaleDateString()}`, { align: 'center' });
        doc.moveDown(2);
        
        // Table Header
        doc.fillColor('#ffffff').rect(50, doc.y, 500, 20).fill('#1f2937');
        doc.fillColor('#ffffff').fontSize(10).text('Roll No', 60, doc.y + 5);
        doc.text('Student Name', 150, doc.y + 5);
        doc.text('Status', 450, doc.y + 5);
        doc.moveDown(1.5);
        
        // Table Rows
        doc.fillColor('#000000').fontSize(11);
        let currentY = doc.y;
        
        students.forEach((student, i) => {
            let status = 'Not Marked';
            // Find this student's status in the attendance document
            if (attendanceDoc && attendanceDoc.records) {
                const rec = attendanceDoc.records.find(r => r.studentId.toString() === student._id.toString());
                if (rec) status = rec.status;
            }
            
            // Zebra stripes
            if (i % 2 === 0) {
                doc.rect(50, currentY - 2, 500, 20).fill('#f9fafb');
                doc.fillColor('#000000'); // Reset text color
            }
            
            doc.text(student.rollNumber, 60, currentY);
            doc.text(`${student.firstName} ${student.lastName}`, 150, currentY);
            
            // Color code the status text
            if (status === 'Present') doc.fillColor('#10b981');
            else if (status === 'Absent') doc.fillColor('#ef4444');
            else doc.fillColor('#666666');
            
            doc.text(status, 450, currentY);
            doc.fillColor('#000000'); // Reset for next row
            currentY += 20;
        });
        
        doc.end();
    } catch (error) {
        if (res.headersSent) {
            console.error('PDF Error (headers sent):', error);
            return res.end();
        }
        next(error);
    }
};

// 3. Fee Defaulters PDF
export const downloadFeeDefaulters = async (req, res, next) => {
    try {
        const { month } = req.query;
        const defaulters = await Fee.find({ month, status: { $in: ['Pending', 'Partial'] } })
            .populate('studentId', 'firstName lastName rollNumber');
            
        const doc = startPdf(res, `Fee Defaulters - ${month}`);
        doc.fontSize(12);
        
        let totalDue = 0;
        defaulters.forEach((f, i) => {
            const due = f.totalAmount - f.amountPaid;
            totalDue += due;
            doc.text(`${i + 1}. ${f.studentId.rollNumber} - ${f.studentId.firstName} ${f.studentId.lastName} | Due: Rs ${due} (${f.status})`);
        });
        doc.moveDown();
        doc.text(`Total Pending Amount: Rs ${totalDue}`, { bold: true });
        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};

// 4. Fee Receipt PDF (Styled)
export const downloadFeeReceipt = async (req, res, next) => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('studentId', 'firstName lastName rollNumber')
            .populate('classId', 'name');
            
        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Fee_Voucher_${fee.studentId.rollNumber}.pdf"`);
        doc.pipe(res);

        // Header
        doc.rect(20, 20, 555, 80).strokeColor('#2563eb').lineWidth(2).stroke();
        doc.fontSize(20).fillColor('#2563eb').text('FEE VOUCHER', { align: 'center', margin: 20 });
        doc.moveDown(0.5);
        doc.fontSize(10).fillColor('#666666').text('School Management System', { align: 'center' });
        doc.moveDown(2);

        // Student Info
        doc.fillColor('#000000').fontSize(12);
        doc.text(`Student: ${fee.studentId.firstName} ${fee.studentId.lastName} (${fee.studentId.rollNumber})`);
        doc.text(`Class: ${fee.classId?.name || 'N/A'}   |   Month: ${fee.month}`);
        doc.moveDown(2);

        // Table
        doc.fillColor('#ffffff').rect(50, doc.y, 500, 20).fill('#2563eb');
        doc.fillColor('#ffffff').fontSize(10).text('Description', 60, doc.y + 5);
        doc.text('Amount', 450, doc.y + 5);
        doc.moveDown(1.5);

        doc.fillColor('#000000').fontSize(11);
        doc.text('Total Fee', 60, doc.y);
        doc.text(`Rs ${fee.totalAmount}`, 450, doc.y);
        doc.moveDown(1);
        doc.text('Amount Paid', 60, doc.y);
        doc.text(`Rs ${fee.amountPaid}`, 450, doc.y);
        doc.moveDown(1);
        
        let balance = fee.totalAmount - fee.amountPaid;

        // Status Stamp Logic
        doc.moveDown(2);
        if (fee.status === 'Paid') {
            doc.fillColor('#10b981').fontSize(24).text('PAID', 400, doc.y, { bold: true });
        } else {
            doc.fillColor('#ef4444').fontSize(20).text(`${fee.status.toUpperCase()} (Bal: Rs ${balance})`, 300, doc.y, { bold: true });
        }

        doc.moveDown(4);
        doc.fillColor('#666666').fontSize(10).text('This is a computer-generated voucher.', { align: 'center' });
        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};

// 5. Timetable PDF
export const downloadTimetable = async (req, res, next) => {
    try {
        const { classId, sectionId } = req.query;
        const timetable = await Timetable.findOne({ classId, sectionId })
            .populate('schedule.periods.subjectId', 'name')
            .populate('schedule.periods.teacherId', 'profile.firstName profile.lastName');
            
        const doc = startPdf(res, 'Class Timetable');
        doc.fontSize(12);
        
        if (!timetable) { doc.text('No timetable found.'); doc.end(); return; }
        
        timetable.schedule.forEach(day => {
            doc.fontSize(14).text(day.day, { underline: true });
            doc.fontSize(10);
            day.periods.forEach(p => {
                doc.text(`${p.startTime} - ${p.endTime}: ${p.subjectId.name} (${p.teacherId.profile.firstName} ${p.teacherId.profile.lastName})`);
            });
            doc.moveDown(0.5);
        });
        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};

// 6. Class Result Sheet PDF
export const downloadClassResult = async (req, res, next) => {
    try {
        const { examId, classId } = req.query;
        const results = await ExamResult.find({ examId, classId, status: 'Published' })
            .populate('studentId', 'firstName lastName rollNumber')
            .sort('-totalObtained');
            
        const doc = startPdf(res, 'Class Exam Results');
        doc.fontSize(12);
        doc.text('Rank | Roll No | Name | Total | % | Grade', { underline: true });
        doc.moveDown(0.2);
        
        results.forEach((r, i) => {
            doc.text(`${i + 1} | ${r.studentId.rollNumber} | ${r.studentId.firstName} ${r.studentId.lastName} | ${r.totalObtained} | ${r.percentage}% | ${r.grade}`);
        });
        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};

export const downloadReportCard = async (req, res, next) => {
    try {
        const { examId, studentId } = req.params;
        
        const result = await ExamResult.findOne({ examId, studentId })
            .populate('studentId', 'firstName lastName rollNumber')
            .populate('classId', 'name')
            .populate('marks.subjectId', 'name code');
            
        if (!result) return res.status(404).json({ error: 'Result not found' });

        const allResults = await ExamResult.find({ examId, status: 'Published' }).sort({ totalObtained: -1 });
        const rank = allResults.findIndex(r => r.studentId.toString() === studentId) + 1;

        const doc = new PDFDocument({ size: 'A4', margin: 50 });
        res.setHeader('Content-Type', 'application/pdf');
        res.setHeader('Content-Disposition', `inline; filename="Report_Card_${result.studentId.rollNumber}.pdf"`);
        doc.pipe(res);

        let borderColor = '#9ca3af'; 
        let positionText = 'Participant';
        if (rank === 1) { borderColor = '#f59e0b'; positionText = '1st Position Holder'; }
        if (rank === 2) { borderColor = '#9ca3af'; positionText = '2nd Position Holder'; }
        if (rank === 3) { borderColor = '#b45309'; positionText = '3rd Position Holder'; }

        // Outer Border
        doc.rect(20, 20, 555, 760).lineWidth(4).strokeColor(borderColor).stroke();

        // School Header (Mock)
        doc.fontSize(24).fillColor('#1f2937').text('SMS PUBLIC SCHOOL', { align: 'center', bold: true });
        doc.fontSize(10).fillColor('#666666').text('123 Education Street, Knowledge City', { align: 'center' });
        doc.moveDown(1);
        
        // Title
        doc.fontSize(16).fillColor('#2563eb').text('ACADEMIC REPORT CARD', { align: 'center' });
        doc.moveDown(0.5);
        doc.fontSize(12).fillColor(borderColor).text(positionText, { align: 'center', bold: true });
        doc.moveDown(1);
        
        // Student Info Box
        doc.fillColor('#000000').fontSize(11);
        doc.text(`Name: ${result.studentId.firstName} ${result.studentId.lastName}`, 60, doc.y);
        doc.text(`Roll No: ${result.studentId.rollNumber}`, 350, doc.y);
        doc.moveDown(0.5);
        doc.text(`Class: ${result.classId?.name || 'N/A'}`, 60, doc.y);
        doc.moveDown(1.5);

        // Table Header
        const tableTop = doc.y;
        doc.fillColor('#ffffff').rect(50, tableTop, 500, 20).fill('#1f2937');
        doc.fillColor('#ffffff').fontSize(11).text('Subject', 60, tableTop + 5);
        doc.text('Code', 250, tableTop + 5);
        doc.text('Marks', 450, tableTop + 5);
        doc.moveDown(1.5);

        // Marks Rows
        doc.fillColor('#000000').fontSize(11);
        let currentY = doc.y;
        result.marks.forEach((m, i) => {
            if (i % 2 === 0) doc.rect(50, currentY - 2, 500, 20).fill('#f9fafb'); // Zebra stripes
            doc.fillColor('#000000').text(`${m.subjectId?.name || 'N/A'}`, 60, currentY);
            doc.text(`${m.subjectId?.code || 'N/A'}`, 250, currentY);
            doc.text(`${m.obtainedMarks}`, 450, currentY);
            currentY += 20;
        });

        // Summary Section
        doc.moveDown(2);
        doc.fontSize(12).fillColor('#1f2937');
        doc.text(`Total Marks: ${result.totalObtained}`, 60, doc.y, { bold: true });
        doc.text(`Percentage: ${result.percentage}%`, 250, doc.y, { bold: true });
        doc.text(`Grade: ${result.grade}`, 450, doc.y, { bold: true });

        // Signatures
        doc.moveDown(6);
        doc.fontSize(10).fillColor('#666666');
        doc.text('Class Teacher', 60, doc.y);
        doc.text('Principal', 450, doc.y);

        doc.end();
    } catch (error)  {
        // Safety check: If headers are already sent, we can't send a JSON error.
        // We just log it and end the response.
        if (res.headersSent) {
            console.error('PDF Generation Error (headers already sent):', error);
            return res.end();
        }
        next(error);
    }
};