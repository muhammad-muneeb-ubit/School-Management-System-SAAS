import AcademicSession from '../models/AcademicSession.js';
import Class from '../models/Class.js';
import Section from '../models/Section.js';
import Subject from '../models/Subject.js';
import ActivityLog from '../models/ActivityLog.js';
// --- ACADEMIC SESSIONS ---

// @desc    Create a new academic session
// @route   POST /api/academic/sessions
// export const createSession = async (req, res) => {
//     try {
//         const { name, startDate, endDate } = req.body;
//         const session = await AcademicSession.create({ name, startDate, endDate });
//         res.status(201).json(session);
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };
export const createSession = async (req, res, next) => {
    try {
        const { name, startDate, endDate } = req.body;

        // If there are no sessions yet, make this one 'current'
        const existingSessions = await AcademicSession.find();
        const status = existingSessions.length === 0 ? 'current' : 'draft';

        const session = await AcademicSession.create({ name, startDate, endDate, status });
        await ActivityLog.create({
            action: 'create session',
            entity: 'AcademicSession',
            entityId: session._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created academic session ${session.name}` }
        });
        res.status(201).json(session);
    } catch (error) {
        next(error);
    }
};

// @desc    Set an academic session as 'current' (and archive others)
// @route   PUT /api/academic/sessions/:id/set-current
export const setCurrentSession = async (req, res) => {
    try {
        await AcademicSession.updateMany({}, { status: 'archived' });
        const session = await AcademicSession.findByIdAndUpdate(
            req.params.id,
            { status: 'current' },
            { new: true }
        );
        res.json(session);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- CLASSES ---

// @desc    Create a class (scoped to Principal's branch & current session)
// @route   POST /api/academic/classes
export const createClass = async (req, res) => {
    try {
        const { name } = req.body;

        // Find the current session
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session found. Please set one as current.' });

        // Create class using Principal's branchId
        const newClass = await Class.create({
            name,
            branchId: req.user.branchId, // From JWT token
            academicSessionId: currentSession._id
        });
        await ActivityLog.create({
            action: 'create class',
            entity: 'Class',
            entityId: newClass._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created class ${newClass.name}` }
        });
        res.status(201).json(newClass);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all classes for the current session & branch
// @route   GET /api/academic/classes
export const getClasses = async (req, res) => {
    try {
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.json([]);

        const classes = await Class.find({
            branchId: req.user.branchId,
            academicSessionId: currentSession._id
        });
        res.json(classes);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// --- SECTIONS & SUBJECTS ---

// @desc    Create a section inside a class
// @route   POST /api/academic/classes/:classId/sections
export const createSection = async (req, res) => {
    try {
        const { name, capacity } = req.body;
        const section = await Section.create({ name, capacity, classId: req.params.classId });
        await ActivityLog.create({
            action: 'create section',
            entity: 'Section',
            entityId: section._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created section ${section.name}` }
        });
        res.status(201).json(section);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Create a subject for a class
// @route   POST /api/academic/classes/:classId/subjects
export const createSubject = async (req, res) => {
    try {
        const { name, code } = req.body;
        const subject = await Subject.create({ name, code, classId: req.params.classId });
        await ActivityLog.create({
            action: 'create subject',
            entity: 'Subject',
            entityId: subject._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created subject ${subject.name}` }
        });
        res.status(201).json(subject);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Get all sections for a class
// @route   GET /api/academic/classes/:classId/sections
export const getSections = async (req, res, next) => {
    try {
        const sections = await Section.find({ classId: req.params.classId });
        res.json(sections);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all subjects for a class
// @route   GET /api/academic/classes/:classId/subjects
export const getSubjects = async (req, res, next) => {
    try {
        const subjects = await Subject.find({ classId: req.params.classId });
        res.json(subjects);
    } catch (error) {
        next(error);
    }
};
// @desc    Get all academic sessions
// @route   GET /api/academic/sessions
export const getSessions = async (req, res, next) => {
    try {
        const sessions = await AcademicSession.find().sort({ createdAt: -1 });
        res.json(sessions);
    } catch (error) {
        next(error);
    }
};