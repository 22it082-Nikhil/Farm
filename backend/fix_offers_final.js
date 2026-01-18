// Script to transfer ALL offers to the ACTIVE user found in logs
const mongoose = require('mongoose');
const Offer = require('./models/Offer');
const User = require('./models/User');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        // The ID seen in the backend logs (the one the frontend is using)
        const CORRECT_USER_ID = "69621d5b8802a344c20217c1";

        const user = await User.findById(CORRECT_USER_ID);
        if (!user) {
            console.error("User not found: " + CORRECT_USER_ID);
            // Fallback: Check the other one seen in logs 696216aee0636f24e4ea441f
            process.exit(1);
        }

        console.log(`Found Active User: ${user.name} (${user._id})`);

        // Transfer ALL offers to this user
        const res = await Offer.updateMany(
            {},
            {
                $set: {
                    provider: user._id,
                    providerName: user.name
                }
            }
        );

        console.log(`Transferred ${res.modifiedCount} offers to CURRENTLY LOGGED IN user ${user.name}.`);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
