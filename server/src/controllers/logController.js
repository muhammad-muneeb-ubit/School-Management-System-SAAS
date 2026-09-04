import ActivityLog from '../models/ActivityLog.js';

export const getActivityLogs = async (req, res, next) => {
    try {
        const logs = await ActivityLog.find({ branchId: req.user.branchId })
            .populate('performedBy', 'email role')
            .sort({ timestamp: -1 })
            .limit(50); // Get latest 50 logs
            
        res.json(logs);
    } catch (error) {
        next(error);
    }
};