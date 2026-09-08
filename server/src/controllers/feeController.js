import FeeStructure from '../models/FeeStructure.js';
import Fee from '../models/Fee.js';
import Student from '../models/Student.js';
import AcademicSession from '../models/AcademicSession.js';
import ActivityLog from '../models/ActivityLog.js';

// @desc    Principal sets fee structure for a class
// @route   POST /api/fees/structure
export const createFeeStructure = async (req, res, next) => {
    try {
        const { classId, amount, frequency } = req.body;
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        const structure = await FeeStructure.findOneAndUpdate(
            { classId, academicSessionId: currentSession._id },
            { amount, frequency, branchId: req.user.branchId },
            { upsert: true, new: true, setDefaultsOnInsert: true }
        );
        await ActivityLog.create({
            action: 'create fee structure',
            entity: 'FeeStructure',
            entityId: structure._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created/Updated fee structure for class ${classId}` }
        });

        res.status(201).json({ message: 'Fee structure saved', structure });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal generates monthly fee invoices for a class
// @route   POST /api/fees/generate
export const generateMonthlyFees = async (req, res, next) => {
    try {
        const { classId, month } = req.body; // month format: "2024-08"
        const currentSession = await AcademicSession.findOne({ status: 'current' });
        if (!currentSession) return res.status(400).json({ error: 'No active academic session.' });

        // 1. Get fee structure for this class
        const structure = await FeeStructure.findOne({ classId, academicSessionId: currentSession._id });
        if (!structure) return res.status(404).json({ error: 'No fee structure found for this class. Please set it first.' });

        // 2. Find all active students in this class
        const students = await Student.find({ classId, status: 'Active' });
        if (students.length === 0) return res.status(404).json({ error: 'No active students found in this class.' });

        // 3. Create Fee invoices (skip if already exists for that month)
        let createdCount = 0;
        for (const student of students) {
            const existingFee = await Fee.findOne({ studentId: student._id, month });
            if (!existingFee) {
                await Fee.create({
                    studentId: student._id,
                    academicSessionId: currentSession._id,
                    branchId: req.user.branchId,
                    classId,
                    month,
                    totalAmount: structure.amount,
                    status: 'Pending'
                });
                createdCount++;
            }
        }
        await ActivityLog.create({
            action: 'generate monthly fees',
            entity: 'Fee',
            entityId: null, // Since multiple fees are created, you might want to log differently
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Generated ${createdCount} fee invoices for ${month} in class ${classId}` }
        });

        res.status(201).json({ message: `Generated ${createdCount} fee invoices for ${month}.` });
    } catch (error) {
        next(error);
    }
};

// @desc    Principal records a fee payment
// @route   PUT /api/fees/:id/pay
export const recordPayment = async (req, res, next) => {
    try {
        const { amountPaid } = req.body;

        // 1. Fetch the document first
        const fee = await Fee.findById(req.params.id);
        if (!fee) return res.status(404).json({ error: 'Fee invoice not found' });

        // 2. Inject the user into the document's locals for the audit plugin
        fee.$locals.user = req.user;

        // 3. Add payment to history
        fee.payments.push({
            amount: amountPaid,
            recordedBy: req.user._id
        });

        // 4. Recalculate totals and status
        fee.amountPaid = fee.payments.reduce((acc, p) => acc + p.amount, 0);

        if (fee.amountPaid >= fee.totalAmount) {
            fee.status = 'Paid';
        } else if (fee.amountPaid > 0) {
            fee.status = 'Partial';
        } else {
            fee.status = 'Pending';
        }

        // 5. Save will trigger the audit plugin's post('save') hook automatically!
        await fee.save();
        await ActivityLog.create({
            action: 'fee payment',
            entity: 'Fee',
            entityId: fee._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Recorded payment of Rs ${amountPaid} for ${fee.month}` }
        });

        res.json({ message: 'Payment recorded successfully', fee });
    } catch (error) {
        next(error);
    }
};

// @desc    Parent/Student views fee history
// @route   GET /api/fees/my-fee?studentId=
export const getMyFees = async (req, res, next) => {
    try {
        const { studentId } = req.query;

        // If Parent, verify child ownership
        if (req.user.role === 'Parent') {
            if (!req.user.children.includes(studentId)) {
                return res.status(403).json({ error: 'Not authorized to view this student.' });
            }
        }

        const fees = await Fee.find({ studentId }).sort({ month: -1 });
        res.json(fees);
    } catch (error) {
        next(error);
    }
};

// @desc    Principal gets all fee records (optionally filtered by class or month)
// @route   GET /api/fees
export const getAllFees = async (req, res, next) => {
    try {
        const { classId, month } = req.query;
        const filter = { branchId: req.user.branchId };

        if (classId) filter.classId = classId;
        if (month) filter.month = month;

        const fees = await Fee.find(filter)
            .populate('studentId', 'firstName lastName rollNumber')
            .populate('classId', 'name')
            .sort({ month: -1 });

        res.json(fees);
    } catch (error) {
        next(error);
    }
};