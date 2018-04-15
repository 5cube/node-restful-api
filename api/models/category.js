const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['created', 'published', 'deleted'], default: 'created', required: true },
    name: { type: String, required: true },
    info: { type: Object, default: {} },
    products: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Product' }]
});

categorySchema.pre('update', function () {
    this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Category', categorySchema);