
const mongoose = require('mongoose');

const RentalSchema = new mongoose.Schema({
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    type: {
        type: String, // e.g., Tractor, Harvester, Irrigation Pump
        required: true
    },
    pricePerHour: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    image: {
        type: String, // Emoji or URL
        default: '🚜'
    },
    status: {
        type: String,
        enum: ['available', 'rented', 'maintenance'],
        default: 'available'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Rental', RentalSchema);
