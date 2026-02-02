const express = require('express');
const router = express.Router();
const ServiceBroadcast = require('../models/ServiceBroadcast');
const User = require('../models/User');

// GET all active broadcasts (For Farmers to browse)
router.get('/', async (req, res) => {
    try {
        const broadcasts = await ServiceBroadcast.find({ status: 'active' })
            .populate('provider', 'name phone location rating avatar')
            .sort({ createdAt: -1 });
        res.json(broadcasts);
    } catch (err) {
        console.error('Error fetching broadcasts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET provider's broadcasts (For Service Provider Dashboard)
router.get('/my-broadcasts', async (req, res) => {
    try {
        const { providerId } = req.query;
        if (!providerId) {
            return res.status(400).json({ message: 'Provider ID is required' });
        }
        const broadcasts = await ServiceBroadcast.find({ provider: providerId })
            .sort({ createdAt: -1 });
        res.json(broadcasts);
    } catch (err) {
        console.error('Error fetching provider broadcasts:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST create a new broadcast
router.post('/', async (req, res) => {
    try {
        const { provider, type, title, description, location, coordinates, budget, availabilityDate, endDate } = req.body;

        const newBroadcast = new ServiceBroadcast({
            provider,
            type,
            title,
            description,
            location,
            coordinates,
            budget,
            availabilityDate,
            endDate
        });

        const savedBroadcast = await newBroadcast.save();
        res.status(201).json(savedBroadcast);
    } catch (err) {
        console.error('Error creating broadcast:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// DELETE broadcast
router.delete('/:id', async (req, res) => {
    try {
        const broadcast = await ServiceBroadcast.findById(req.params.id);
        if (!broadcast) {
            return res.status(404).json({ message: 'Broadcast not found' });
        }

        await ServiceBroadcast.findByIdAndDelete(req.params.id);
        res.json({ message: 'Broadcast removed' });
    } catch (err) {
        console.error('Error deleting broadcast:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

// PUT update status (e.g. mark as filled)
router.put('/:id/status', async (req, res) => {
    try {
        const { status } = req.body;
        const broadcast = await ServiceBroadcast.findByIdAndUpdate(
            req.params.id,
            { status },
            { new: true }
        );
        res.json(broadcast);
    } catch (err) {
        console.error('Error updating broadcast status:', err);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
