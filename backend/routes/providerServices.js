const express = require('express');
const router = express.Router();
const ProviderService = require('../models/ProviderService');

// Get all services (optionally filtered by providerId)
router.get('/', async (req, res) => {
    try {
        const { providerId } = req.query;
        let query = {};
        if (providerId) {
            query.provider = providerId;
        }
        const services = await ProviderService.find(query).populate('provider', 'name').sort({ createdAt: -1 });
        res.json(services);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Create a new service listing
router.post('/', async (req, res) => {
    try {
        const { provider, title, type, description, rate, availability, contactPhone, contactEmail, experience, image } = req.body;

        // Validate required fields
        if (!provider || !title || !description || !rate || !contactPhone) {
            return res.status(400).json({ message: "Missing required fields" });
        }

        const newService = new ProviderService({
            provider,
            title,
            type,
            description,
            rate,
            availability,
            contactPhone,
            contactEmail,
            experience,
            image: image || '🛠️',
            blockedDates: req.body.blockedDates || []
        });

        const savedService = await newService.save();
        res.status(201).json(savedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Update a service listing
router.put('/:id', async (req, res) => {
    try {
        const updatedService = await ProviderService.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true }
        );
        res.json(updatedService);
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

// Delete a service listing
router.delete('/:id', async (req, res) => {
    try {
        await ProviderService.findByIdAndDelete(req.params.id);
        res.json({ message: 'Service deleted successfully' });
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
