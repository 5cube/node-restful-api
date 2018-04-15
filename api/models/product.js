const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: {
        type: String,
        enum: ['created', 'published', 'deleted'],
        default: 'created',
        required: true
    },
    name: { type: String, required: true },
    price: { type: Number, required: true },
    info: { type: Object, default: {} },
    subtitle: { type: String, default: '' },
    units: { type: Object, default: {} },
    images: { type: Array, default: [] },
    inventory: { type: Number, default: 0 },
    category: { type: mongoose.Schema.Types.ObjectId, ref: 'Category' }
});

productSchema.pre('update', function () {
    this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Product', productSchema);