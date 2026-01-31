
const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');
const ProviderService = require('../models/ProviderService');
const Notification = require('../models/Notification');

// @route   GET api/service-requests
// @desc    Get all requests for a specific farmer
// @access  Public
router.get('/', async (req, res) => {
    const { farmerId } = req.query;
    try {
        let query = {};
        if (farmerId) {
            query.farmer = farmerId;
        }

        // Populate farmer details so Provider sees who posted it
        const requests = await ServiceRequest.find(query)
            .populate('farmer', 'name email')
            .sort({ createdAt: -1 });

        res.json(requests);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/service-requests
// @desc    Create a new service request
// @access  Public
router.post('/', async (req, res) => {
    const { farmer, type, description, location, duration, budget, scheduledDate, endDate } = req.body;
    try {
        const newRequest = new ServiceRequest({
            farmer,
            type,
            description,
            location,
            coordinates: req.body.coordinates,
            coordinates: req.body.coordinates,
            duration,
            budget,
            scheduledDate,
            endDate
        });
        const request = await newRequest.save();

        // 🔔 Trigger Notifications for Matching Providers
        try {
            // Find all providers who offer this service type
            const matchingServices = await ProviderService.find({ type: type }).select('provider');

            // Deduplicate provider IDs (in case one provider has multiple services of same type)
            const providerIds = [...new Set(matchingServices.map(s => s.provider.toString()))];

            // Create notifications
            const notifications = providerIds.map(providerId => ({
                recipient: providerId,
                type: 'new_job',
                message: `New ${type} Job Posted in ${location}`,
                relatedId: request._id
            }));

            if (notifications.length > 0) {
                await Notification.insertMany(notifications);
            }
        } catch (notifErr) {
            console.error("Error sending notifications:", notifErr);
            // Don't fail the request if notifications fail
        }

        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/service-requests/:id
// @desc    Update a service request
// @access  Public
router.put('/:id', async (req, res) => {
    const { type, description, location, duration, budget, status, scheduledDate, endDate } = req.body;
    try {
        let request = await ServiceRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        request.type = type || request.type;
        request.description = description || request.description;
        request.location = location || request.location;
        if (req.body.coordinates) {
            request.coordinates = req.body.coordinates;
        }
        request.duration = duration || request.duration;
        request.budget = budget || request.budget;
        request.status = status || request.status;
        request.scheduledDate = scheduledDate || request.scheduledDate;
        request.endDate = endDate || request.endDate;

        await request.save();
        res.json(request);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/service-requests/:id
// @desc    Delete a service request
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        let request = await ServiceRequest.findById(req.params.id);
        if (!request) return res.status(404).json({ msg: 'Request not found' });

        await ServiceRequest.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Request removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
