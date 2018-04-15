const mongoose = require('mongoose');

const orderSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    createdAt: { type: Date, default: Date.now },
    updatedAt: { type: Date, default: Date.now },
    status: { type: String, enum: ['created', 'verified', 'onway', 'delivered', 'deleted'],
    default: 'created', required: true },
    info: { type: Object, default: {} },
    totalAmount: { type: Number, default: 0 },
    items: [
        {
            quantity: { type: Number, default: 1, required: true },
            amount: { type: Number, default: 0, required: true },
            product: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true }
        }
    ]
});

orderSchema.pre('update', function () {
    this.update({}, { $set: { updatedAt: new Date() } });
});

module.exports = mongoose.model('Order', orderSchema);