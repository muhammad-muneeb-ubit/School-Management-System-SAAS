import ActivityLog from '../models/ActivityLog.js';

export const getActivityLogs = async (req, res, next) => {
    try {
        let filter = {};
        // If Principal, only fetch their branch logs. If Super Admin, fetch ALL logs.
        if (req.user.role === 'Principal') {
            filter.branchId = req.user.branchId;
        }

        const logs = await ActivityLog.find(filter)
            .populate('performedBy', 'email role')
            .sort({ timestamp: -1 })
            .limit(50);
            
        res.json(logs);
    } catch (error) {
        next(error);
    }
};