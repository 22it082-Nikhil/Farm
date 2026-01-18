
const express = require('express');
const router = express.Router();
const Crop = require('../models/Crop');

// @route   GET api/crops
// @desc    Get all crops (optionally filtered by farmer)
// @access  Public
router.get('/', async (req, res) => {
    const { farmerId } = req.query;
    try {
        let query = {};
        if (farmerId) {
            query.farmer = farmerId;
        }
        const crops = await Crop.find(query)
            .populate('farmer', 'name')
            .sort({ createdAt: -1 });
        res.json(crops);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/crops
// @desc    Add a new crop
// @access  Public
router.post('/', async (req, res) => {
    const { farmer, name, quantity, price, image } = req.body;
    try {
        const newCrop = new Crop({
            farmer,
            name,
            quantity,
            price,
            image
        });
        const crop = await newCrop.save();
        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/crops/:id
// @desc    Update a crop
// @access  Public
router.put('/:id', async (req, res) => {
    const { name, quantity, price, status } = req.body;
    try {
        let crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ msg: 'Crop not found' });

        crop.name = name || crop.name;
        crop.quantity = quantity || crop.quantity;
        crop.price = price || crop.price;
        crop.status = status || crop.status;

        await crop.save();
        res.json(crop);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/crops/:id
// @desc    Delete a crop
// @access  Public
router.delete('/:id', async (req, res) => {
    try {
        let crop = await Crop.findById(req.params.id);
        if (!crop) return res.status(404).json({ msg: 'Crop not found' });

        await Crop.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Crop removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
