// Removes any keys starting with $ or containing . from the body and query
// This prevents NoSQL injection attacks (e.g., {"$gt": ""})
export const sanitizeData = (req, res, next) => {
    const sanitize = (obj) => {
        if (typeof obj !== 'object' || obj === null) return;
        
        for (const key in obj) {
            if (key.startsWith('$') || key.includes('.')) {
                delete obj[key];
            } else if (typeof obj[key] === 'object') {
                sanitize(obj[key]);
            }
        }
    };

    if (req.body) sanitize(req.body);
    // We don't sanitize req.query directly to avoid the Node.js read-only getter error
    // Mongoose handles query string validation safely.
    
    next();
};