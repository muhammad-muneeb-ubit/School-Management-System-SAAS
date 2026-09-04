import ActivityLog from '../models/ActivityLog.js';

export default function auditPlugin(schema, options) {
    // We don't need to set $locals in pre-hook if we set it on the document directly in the controller
    
    schema.post('save', function(doc) {
        // Read user from document's $locals
        const user = this.$locals && this.$locals.user ? this.$locals.user : null;
        logActivity('save', doc, user);
    });

    schema.post('updateOne', function(result) {
        // For updateOne queries (e.g., Fee.updateOne(...))
        const user = this.$locals && this.$locals.user ? this.$locals.user : null;
        logActivity('update', this.getQuery(), user, this.model.modelName);
    });

    schema.post('deleteOne', function(result) {
        const user = this.$locals && this.$locals.user ? this.$locals.user : null;
        logActivity('delete', this.getQuery(), user, this.model.modelName);
    });
};

async function logActivity(action, doc, user, modelName = null) {
    try {
        if (!user) return; // Don't log if we don't know who did it
        
        const entity = modelName || doc.constructor.modelName;
        const entityId = doc._id || doc.id;

        await ActivityLog.create({
            action,
            entity,
            entityId,
            performedBy: user._id,
            branchId: user.branchId,
            changes: doc.toObject ? doc.toObject() : doc
        });
    } catch (error) {
        console.error('Failed to log activity:', error.message);
    }
}