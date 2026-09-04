import Branch from '../models/Branch.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';

// @desc    Super Admin creates a new branch (respecting the limit)
// @route   POST /api/admin/branches
export const createBranch = async (req, res) => {
    try {
        const { name, address } = req.body;

        // 1. Check the limit set by Super Admin
        const settings = await Setting.findOne();
        const branchCount = await Branch.countDocuments();

        if (branchCount >= settings.maxBranches) {
            return res.status(403).json({ error: `Branch limit reached. Max allowed: ${settings.maxBranches}` });
        }

        // 2. Create the branch
        const branch = await Branch.create({ name, address });
        res.status(201).json({ message: 'Branch created successfully', branch });

    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// @desc    Super Admin updates the branch limit
// @route   PUT /api/admin/settings/max-branches
export const updateMaxBranches = async (req, res) => {
    try {
        const { maxBranches } = req.body;
        
        const settings = await Setting.findOneAndUpdate(
            {}, 
            { maxBranches }, 
            { new: true, upsert: true }
        );

        res.status(200).json({ message: 'Max branches updated', settings });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
};

// export const createPrincipal = async (req, res) => {
//     try {
//         const { email, password, branchId } = req.body;

//         const principalExists = await User.findOne({ role: 'Principal' });
//         if (principalExists) {
//             return res.status(400).json({ error: 'A Principal account already exists for this school.' });
//         }

//         const principal = await User.create({
//             email,
//             password,
//             role: 'Principal',
//             branchId
//         });

//         res.status(201).json({ message: 'Principal account created successfully', principal });
//     } catch (error) {
//         res.status(500).json({ error: error.message });
//     }
// };

// @desc    Super Admin creates a Principal account
// @route   POST /api/admin/principal
export const createPrincipal = async (req, res, next) => {
    try {
        const { email, password, branchId } = req.body;

        const userExists = await User.findOne({ email });
        if (userExists) {
            return res.status(400).json({ error: 'User with this email already exists.' });
        }

        const principal = await User.create({
            email,
            password,
            role: 'Principal',
            branchId
        });

        res.status(201).json({ message: 'Principal account created successfully', principal });
    } catch (error) {
        next(error);
    }
};

// @desc    Get all Principals
// @route   GET /api/admin/principals
export const getPrincipals = async (req, res, next) => {
    try {
        const principals = await User.find({ role: 'Principal' })
            .select('-password')
            .populate('branchId', 'name');
        res.json(principals);
    } catch (error) {
        next(error);
    }
};

// ... existing functions ...

// @desc    Get system settings
// @route   GET /api/admin/settings
export const getSettings = async (req, res, next) => {
    try {
        const settings = await Setting.findOne();
        res.json(settings);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all branches
// @route   GET /api/admin/branches
export const getBranches = async (req, res, next) => {
    try {
        const branches = await Branch.find();
        res.json(branches);
    } catch (error) {
        next(error);
    }
};

// @desc    Get all users (Super Admin needs this to check if Principal exists)
// @route   GET /api/admin/users
export const getUsers = async (req, res, next) => {
    try {
        const users = await User.find().select('-password');
        res.json(users);
    } catch (error) {
        next(error);
    }
};