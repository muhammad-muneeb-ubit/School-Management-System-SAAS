import Exam from '../models/Exam.js';
import ExamResult from '../models/ExamResult.js';
import AcademicSession from '../models/AcademicSession.js';

// Helper function to calculate grade
const calculateGrade = (percentage) => {
    if (percentage >= 90) return 'A+';
    if (percentage >= 80) return 'A';
    if (percentage >= 70) return 'B';
    if (percentage >= 60) return 'C';
    if (percentage >= 40) return 'D';
    return 'F';
};

// @desc    Principal creates an Exam
// @route   POST /api/exams
export const createExam = async (req, res, next) => {
    try {
        const { name, classId, totalMarksPerSubject, passingPercentage } = req.body;
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        const exam = await Exam.create({
            name,
            classId,
            totalMarksPerSubject,
            passingPercentage,
            academicSessionId: currentSession._id,
            branchId: req.user.branchId
        });

        res.status(201).json(exam);
    } catch (error) {
        next(error);
    }
};

// @desc    Teacher enters/updates marks for a student
// @route   PUT /api/exams/:examId/marks
export const enterMarks = async (req, res, next) => {
    try {
        const { examId } = req.params;
        const { studentId, subjectId, obtainedMarks } = req.body;

        const exam = await Exam.findById(examId);
        if (!exam) return res.status(404).json({ error: 'Exam not found' });

        // Find existing result or create a new one
        let result = await ExamResult.findOne({ examId, studentId });
        
        if (!result) {
            result = new ExamResult({
                examId,
                studentId,
                classId: exam.classId,
                status: 'Pending'
            });
        }

        // Check if mark for this subject already exists
        const markIndex = result.marks.findIndex(m => m.subjectId.toString() === subjectId);

        if (markIndex > -1) {
            // Update existing mark
            result.marks[markIndex].obtainedMarks = obtainedMarks;
            result.marks[markIndex].enteredBy = req.user._id;
        } else {
            // Add new mark
            result.marks.push({ subjectId, obtainedMarks, enteredBy: req.user._id });
        }

        // Recalculate total and percentage
        const totalObtained = result.marks.reduce((acc, curr) => acc + curr.obtainedMarks, 0);
        const totalPossible = exam.totalMarksPerSubject * result.marks.length;
        const percentage = totalPossible > 0 ? (totalObtained / totalPossible) * 100 : 0;

        result.totalObtained = totalObtained;
        result.percentage = Math.round(percentage * 100) / 100; // Round to 2 decimals
        result.grade = calculateGrade(percentage);

        await result.save();
        res.json({ message: 'Marks saved successfully', result });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal publishes all results for an Exam
// @route   PUT /api/exams/:examId/publish
export const publishResults = async (req, res, next) => {
    try {
        const { examId } = req.params;

        // Update exam status
        await Exam.findByIdAndUpdate(examId, { status: 'Published' });

        // Update all pending/submitted results to Published
        await ExamResult.updateMany(
            { examId },
            { status: 'Published' }
        );

        res.json({ message: 'Exam results published successfully' });
    } catch (error) {
        next(error);
    }
};

// @desc    Student/Parent gets results for a specific exam
// @route   GET /api/exams/:examId/result?studentId=
export const getStudentResult = async (req, res, next) => {
    try {
        const { examId } = req.params;
        const { studentId } = req.query;

        // If Parent, verify child ownership
        if (req.user.role === 'Parent') {
            if (!req.user.children.includes(studentId)) {
                return res.status(403).json({ error: 'Not authorized to view this student.' });
            }
        }

        const result = await ExamResult.findOne({ examId, studentId })
            .populate('marks.subjectId', 'name code')
            .populate('marks.enteredBy', 'email');
            
        const exam = await Exam.findById(examId).select('name totalMarksPerSubject status');

        res.json({ exam, result });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all exams for the school
// @route   GET /api/exams
export const getExams = async (req, res, next) => {
    try {
        const exams = await Exam.find({ branchId: req.user.branchId })
            .populate('classId', 'name')
            .sort({ createdAt: -1 });
        res.json(exams);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all published results for a specific student
// @route   GET /api/exams/student-results/:studentId
export const getStudentAllResults = async (req, res, next) => {
    try {
        const { studentId } = req.params;

        // If Parent, verify child ownership
        if (req.user.role === 'Parent' && !req.user.children.includes(studentId)) {
            return res.status(403).json({ error: 'Not authorized to view this student.' });
        }

        const results = await ExamResult.find({ studentId, status: 'Published' })
            .populate('examId', 'name')
            .populate('marks.subjectId', 'name code')
            .sort({ createdAt: -1 });

        res.json(results);
    } catch (error) {
        next(error);
    }
};