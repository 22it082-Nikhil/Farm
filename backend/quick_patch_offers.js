// One-time script to patch legacy offers for specific providers
const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const TARGET_NAME = "Manav Meshiya";

        // 1. Find the User ID for Manav Meshiya
        const providerUser = await User.findOne({ name: { $regex: new RegExp(TARGET_NAME, 'i') } });

        if (!providerUser) {
            console.error("User 'Manav Meshiya' not found!");
            process.exit(1);
        }

        console.log(`Found User: ${providerUser.name} (${providerUser._id})`);

        // 2. Find Offers with this providerName but MISSING provider ID
        const offersToPatch = await Offer.find({
            providerName: { $regex: new RegExp(TARGET_NAME, 'i') },
            provider: { $exists: false } // or null
        });

        console.log(`Found ${offersToPatch.length} legacy offers to patch.`);

        if (offersToPatch.length > 0) {
            const res = await Offer.updateMany(
                { _id: { $in: offersToPatch.map(o => o._id) } },
                { $set: { provider: providerUser._id } }
            );
            console.log(`Updated ${res.modifiedCount} offers.`);
        }

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
