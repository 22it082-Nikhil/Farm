const mongoose = require('mongoose');

const offerSchema = new mongoose.Schema({
    offerType: {
        type: String,
        enum: ['crop', 'service', 'need_fulfillment'],
        default: 'crop'
    },
    farmer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    // ID of the Service Provider (for service bids)
    provider: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // ID of the Buyer (for crop offers)
    buyer: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    },
    // For Crop Offers
    crop: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Crop'
    },
    // For Buyer Need Fulfillments (Reverse Bidding)
    buyerNeed: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'BuyerNeed'
    },
    pricePerUnit: {
        type: Number
    },
    quantityRequested: {
        type: Number
    },
    // For Service Bids
    serviceRequest: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'ServiceRequest'
    },
    bidAmount: {
        type: String
    },
    providerName: {
        type: String,
        default: 'Service Provider'
    },
    buyerName: {
        type: String,
        default: 'Local Buyer'
    },
    status: {
        type: String,
        enum: ['pending', 'accepted', 'rejected', 'completed'],
        default: 'pending'
    },
    // Dynamic Tracking History
    trackingUpdates: [{
        status: {
            type: String,
            enum: ['pending', 'accepted', 'packed', 'shipped', 'out_for_delivery', 'delivered'],
            required: true
        },
        location: {
            type: String,
            required: true
        },
        note: String,
        timestamp: {
            type: Date,
            default: Date.now
        }
    }],
    message: {
        type: String
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Offer', offerSchema);
