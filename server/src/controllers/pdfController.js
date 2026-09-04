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
        const { classId, sectionId } = req.query;
        const students = await Student.find({ classId, sectionId, status: 'Active' }).sort('rollNumber');
        
        const doc = startPdf(res, 'Student List');
        doc.fontSize(12).text(`Total Students: ${students.length}`, { underline: true });
        doc.moveDown(0.5);
        
        students.forEach((s, i) => {
            doc.text(`${i + 1}. ${s.rollNumber} - ${s.firstName} ${s.lastName} (${s.gender})`);
        });
        
        doc.end();
    } catch (error) { next(error); }
};

// 2. Attendance Sheet PDF (Monthly Grid)
export const downloadAttendanceSheet = async (req, res, next) => {
    try {
        const { classId, sectionId, month } = req.query; // month = "2024-08"
        
        const students = await Student.find({ classId, sectionId, status: 'Active' }).sort('rollNumber');
        const doc = startPdf(res, `Attendance Sheet - ${month}`);
        
        // Simple List view for MVP (Grids are complex in PDFKit without plugins)
        doc.fontSize(10);
        doc.text('Roll No | Student Name | Status', { underline: true });
        doc.moveDown(0.2);
        
        for (const student of students) {
            const attendanceRecords = await Attendance.find({
                classId, sectionId,
                date: { $regex: `^${month}` }, // Matches YYYY-MM
                'records.studentId': student._id
            }).select('date records.$');
            
            doc.text(`${student.rollNumber} | ${student.firstName} ${student.lastName}`);
            attendanceRecords.forEach(rec => {
                const status = rec.records[0].status;
                doc.text(`     ${rec.date.toDateString()}: ${status}`);
            });
            doc.moveDown(0.5);
        }
        doc.end();
    } catch (error) { next(error); }
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
    } catch (error) { next(error); }
};

// 4. Fee Receipt PDF
export const downloadFeeReceipt = async (req, res, next) => {
    try {
        const fee = await Fee.findById(req.params.id)
            .populate('studentId', 'firstName lastName rollNumber');
            
        const doc = startPdf(res, 'Fee Receipt');
        doc.fontSize(12);
        doc.text(`Student: ${fee.studentId.firstName} ${fee.studentId.lastName} (${fee.studentId.rollNumber})`);
        doc.text(`Month: ${fee.month}`);
        doc.text(`Total Amount: Rs ${fee.totalAmount}`);
        doc.text(`Amount Paid: Rs ${fee.amountPaid}`);
        doc.text(`Status: ${fee.status}`);
        doc.moveDown();
        doc.text('Payment History:', { underline: true });
        fee.payments.forEach(p => {
            doc.text(`- Rs ${p.amount} on ${new Date(p.date).toDateString()}`);
        });
        doc.end();
    } catch (error) { next(error); }
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
    } catch (error) { next(error); }
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
    } catch (error) { next(error); }
};