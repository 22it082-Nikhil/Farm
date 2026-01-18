// One-time script to merge offers from conflicting users
const mongoose = require('mongoose');
const Offer = require('./models/Offer');
require('dotenv').config();

mongoose.connect(process.env.MONGODB_URI)
    .then(async () => {
        console.log('Connected to MongoDB');

        const FROM_ID = "696216aee0636f24e4ea441f"; // Dhwanil
        const TO_ID = "69621d5b8802a344c20217c1";   // Manav

        const res = await Offer.updateMany(
            { provider: FROM_ID },
            {
                $set: {
                    provider: TO_ID,
                    providerName: "Manav Meshiya"
                }
            }
        );

        console.log(`Transferred ${res.modifiedCount} offers from Dhwanil to Manav.`);
        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
