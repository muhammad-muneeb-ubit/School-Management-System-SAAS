import Branch from '../models/Branch.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';
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
        await ActivityLog.create({
                    action: 'create branch',
                    entity: 'Branch',
                    entityId: branch._id,
                    performedBy: req.user._id,
                    branchId: req.user.branchId,
                    changes: { message: `Created branch: ${name}` }
                });
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
            { returnDocument: 'after', upsert: true }
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

        await ActivityLog.create({
            action: 'create principal',
            entity: 'User',
            entityId: principal._id,
            performedBy: req.user._id,
            branchId: req.user.branchId,
            changes: { message: `Created principal account for ${email}` }
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

export const createParent = async (req, res, next) => {
    try {
        const { email, password, firstName, lastName, phone } = req.body;
        const exists = await User.findOne({ email });
        if (exists) return res.status(400).json({ error: 'User with this email already exists' });

        const parent = await User.create({
            email, password, role: 'Parent',
            branchId: req.user.branchId,
            profile: { firstName, lastName, phone }
        });
        await ActivityLog.create({
                    action: 'create parent',
                    entity: 'User',
                    entityId: parent._id,
                    performedBy: req.user._id,
                    branchId: req.user.branchId,
                    changes: { message: `Created parent account for ${email}` }
                });
        res.status(201).json(parent);
    } catch (error) { next(error); }
};

// @desc    Get all parents
// @route   GET /api/users/parents
export const getParents = async (req, res, next) => {
    try {
        const parents = await User.find({ role: 'Parent', branchId: req.user.branchId }).select('-password');
        res.json(parents);
    } catch (error) { next(error); }
};
// @desc    Update Principal's Branch
// @route   PUT /api/admin/principals/:id/branch
export const updatePrincipalBranch = async (req, res, next) => {
    try {
        const { branchId } = req.body;
        const principal = await User.findByIdAndUpdate(req.params.id, { branchId }, { returnDocument: 'after' });
        await ActivityLog.create({
                    action: 'update principal branch',
                    entity: 'User',
                    entityId: principal._id,
                    performedBy: req.user._id,
                    branchId: req.user.branchId,
                    changes: { message: `Updated principal's branch to ${branchId}` }
                });
        res.json(principal);
    } catch (error) { next(error); }
};