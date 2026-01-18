
const express = require('express');
const router = express.Router();
const Rental = require('../models/Rental');

// @route   GET api/rentals
// @desc    Get all rentals for a specific farmer
// @access  Public
router.get('/', async (req, res) => {
    const { farmerId } = req.query;
    try {
        const rentals = await Rental.find({ farmer: farmerId }).sort({ createdAt: -1 });
        res.json(rentals);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/rentals
// @desc    Add a new rental item
// @access  Public
router.post('/', async (req, res) => {
    const { farmer, name, type, pricePerHour, description, image, status } = req.body;
    try {
        const newRental = new Rental({
            farmer,
            name,
            type,
            pricePerHour,
            description,
            image,
            status
        });
        const rental = await newRental.save();
        res.json(rental);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/rentals/:id
// @desc    Update a rental item
// @access  Public
router.put('/:id', async (req, res) => {
    const { name, type, pricePerHour, description, image, status } = req.body;
    try {
        let rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ msg: 'Rental item not found' });

        rental.name = name || rental.name;
        rental.type = type || rental.type;
        rental.pricePerHour = pricePerHour || rental.pricePerHour;
        rental.description = description || rental.description;
        rental.image = image || rental.image;
        rental.status = status || rental.status;

        await rental.save();
        res.json(rental);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/rentals/:id
// @desc    Delete a rental item
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        let rental = await Rental.findById(req.params.id);
        if (!rental) return res.status(404).json({ msg: 'Rental item not found' });

        await Rental.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Rental item removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
