const mongoose = require('mongoose');

const ProviderServiceSchema = new mongoose.Schema({
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    title: {
        type: String,
        required: true
    },
    type: {
        type: String, // Vehicle, Manpower, Equipment, etc.
        required: true
    },
    description: {
        type: String,
        required: true
    },
    rate: {
        type: String,
        required: true
    },
    availability: {
        type: String,
        required: false
    },
    contactPhone: {
        type: String,
        required: true
    },
    contactEmail: {
        type: String,
        required: false
    },
    experience: {
        type: String,
        required: false
    },
    status: {
        type: String,
        enum: ['active', 'inactive'],
        default: 'active'
    },
    image: {
        type: String,
        default: '🛠️'
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('ProviderService', ProviderServiceSchema);
