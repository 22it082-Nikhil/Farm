const mongoose = require('mongoose');
require('dotenv').config();

const cleanData = async () => {
    try {
        // Connect to MongoDB
        await mongoose.connect('mongodb://localhost:27017/farmconnect');
        console.log('MongoDB Connected for Cleanup');

        // Access native driver database instance
        const db = mongoose.connection.db;

        // Drop collections to remove corrupted data
        try {
            await db.collection('servicerequests').drop();
            console.log('Dropped servicerequests collection');
        } catch (e) {
            console.log('servicerequests collection not found or already empty');
        }

        try {
            await db.collection('offers').drop();
            console.log('Dropped offers collection');
        } catch (e) {
            console.log('offers collection not found or already empty');
        }

        console.log('Cleanup Complete');
        process.exit();
    } catch (err) {
        console.error('Cleanup Error:', err);
        process.exit(1);
    }
};

cleanData();
