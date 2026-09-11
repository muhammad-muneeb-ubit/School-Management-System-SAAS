import Branch from '../models/Branch.js';
import Setting from '../models/Setting.js';
import User from '../models/User.js';
import ActivityLog from '../models/ActivityLog.js';

// Helper function to get default settings to avoid hardcoding inconsistencies
const getDefaultSettings = () => ({
    maxBranches: 3,
    schoolName: 'SMS',
    theme: {
        primary: '#2563eb', primaryHover: '#1d4ed8', primaryLight: '#eff6ff', primaryDark: '#1e3a8a',
        secondary: '#64748b', secondaryHover: '#475569', secondaryLight: '#f1f5f9',
        sidebarBg: '#1e3a8a', sidebarHover: '#1d4ed8', sidebarActive: '#172033'
    }
});

// @desc    Super Admin creates a new branch (respecting the limit)
// @route   POST /api/admin/branches
export const createBranch = async (req, res, next) => {
    try {
        const { name, address } = req.body;
        const settings = await Setting.findOne();
        const branchCount = await Branch.countDocuments();

        if (settings && branchCount >= settings.maxBranches) {
            return res.status(403).json({ error: `Branch limit reached. Max allowed: ${settings.maxBranches}` });
        }

        const branch = await Branch.create({ name, address });
        
        await ActivityLog.create({
            action: 'create',
            entity: 'Branch',
            entityId: branch._id,
            performedBy: req.user._id,
            // Super Admin doesn't have a branchId, so we check if it exists
            branchId: req.user.branchId || null, 
            changes: { message: `Created branch: ${name}` }
        });

        res.status(201).json({ message: 'Branch created successfully', branch });
    } catch (error) {
        next(error);
    }
};

// @desc    Super Admin updates the branch limit
// @route   PUT /api/admin/settings/max-branches
export const updateMaxBranches = async (req, res, next) => {
    try {
        const { maxBranches } = req.body;
        const settings = await Setting.findOneAndUpdate(
            {}, 
            { maxBranches }, 
            { returnDocument: 'after', upsert: true } // upsert creates it if it doesn't exist
        );
        res.status(200).json({ message: 'Max branches updated', settings });
    } catch (error) {
        next(error);
    }
};

// @desc    Super Admin creates a Principal account
// @route   POST /api/admin/principal
export const createPrincipal = async (req, res, next) => {
    try {
        const { email, password, branchId } = req.body;
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ error: 'User with this email already exists.' });

        const principal = await User.create({ email, password, role: 'Principal', branchId });

        await ActivityLog.create({
            action: 'create',
            entity: 'User',
            entityId: principal._id,
            performedBy: req.user._id,
            branchId: req.user.branchId || null,
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
        let settings = await Setting.findOne();
        if (!settings) {
            // Use default fallback if database is completely empty
            settings = await Setting.create(getDefaultSettings());
        }
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

// @desc    Get all users
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
            action: 'create',
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
            action: 'update',
            entity: 'User',
            entityId: principal._id,
            performedBy: req.user._id,
            branchId: req.user.branchId || null,
            changes: { message: `Updated principal's branch` }
        });

        res.json(principal);
    } catch (error) { next(error); }
};

// @desc    Update School Theme
// @route   PUT /api/admin/settings/theme
export const updateTheme = async (req, res, next) => {
    try {
        let settings = await Setting.findOne();
        if (!settings) {
            // Use default fallback if database is completely empty
            settings = new Setting(getDefaultSettings());
        }
        
        settings.theme = req.body;
        await settings.save();
        
        res.json(settings.theme);
    } catch (error) {
        next(error);
    }
};

// @desc    Get Public Settings (for login page styling)
// @route   GET /api/admin/settings/public
export const getPublicSettings = async (req, res, next) => {
    try {
        const settings = await Setting.findOne();
        if (!settings) {
            // Return defaults without saving to DB (for public route)
            return res.json(getDefaultSettings());
        }
        res.json({ schoolName: settings.schoolName, theme: settings.theme });
    } catch (error) { 
        next(error); 
    }
};