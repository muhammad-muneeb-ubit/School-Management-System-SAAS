export default function softDeletePlugin(schema) {
    // Add fields
    schema.add({
        isDeleted: { type: Boolean, default: false, select: false }, // hidden by default
        deletedAt: { type: Date, default: null, select: false }
    });

    // MongoDB TTL Index: Automatically hard-deletes 90 days (7,776,000 seconds) after deletedAt is set
    schema.index({ deletedAt: 1 }, { expireAfterSeconds: 7776000 });

    // Override find queries to exclude soft-deleted items by default
    schema.pre(/^find/, function () {
        if (this.getQuery().includeDeleted !== true) {
            this.where({ isDeleted: { $ne: true } });
        }
    });
    // Add a softDelete method to documents
    schema.methods.softDelete = function () {
        this.isDeleted = true;
        this.deletedAt = new Date();
        return this.save();
    };
}