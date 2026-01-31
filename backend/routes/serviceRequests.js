
const express = require('express');
const router = express.Router();
const ServiceRequest = require('../models/ServiceRequest');

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
    const { farmer, type, description, location, duration, budget } = req.body;
    try {
        const newRequest = new ServiceRequest({
            farmer,
            type,
            description,
            location,
            coordinates: req.body.coordinates,
            duration,
            budget
        });
        const request = await newRequest.save();
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
    const { type, description, location, duration, budget, status } = req.body;
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
