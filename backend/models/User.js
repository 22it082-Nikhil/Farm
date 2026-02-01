
const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true,
        unique: true
    },
    clerkId: {
        type: String,
        unique: true,
        sparse: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        required: true
    },
    role: {
        type: String,
        enum: ['farmer', 'service', 'buyer'],
        required: true
    },
    organization: {
        type: String
    },
    location: {
        type: String,
        default: ''
    },
    farmSize: {
        type: String,
        default: ''
    },
    latitude: {
        type: String,
        default: ''
    },
    longitude: {
        type: String,
        default: ''
    },
    bio: {
        type: String,
        default: ''
    },
    savedCrops: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop'
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('User', UserSchema);
