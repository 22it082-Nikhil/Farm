
const mongoose = require('mongoose');

const CropSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String, // e.g., Wheat, Rice
        required: true
    },
    quantity: {
        type: String, // e.g., "500 kg"
        required: true
    },
    price: {
        type: String, // e.g., "$1.20/kg"
        required: true
    },
    status: {
        type: String,
        enum: ['active', 'pending', 'sold'],
        default: 'active'
    },
    image: {
        type: String, // Emoji or URL
        default: '🌾'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Crop', CropSchema);
