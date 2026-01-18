const express = require('express');
const router = express.Router();
const User = require('../models/User');

// Get user details (including populated saved crops)
router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id)
            .populate({
                path: 'savedCrops',
                populate: { path: 'farmer', select: 'name' } // Populate farmer details inside crop
            });

        if (!user) return res.status(404).json({ message: 'User not found' });
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

// Toggle saved crop
router.put('/:id/toggle-save', async (req, res) => {
    try {
        const { cropId } = req.body;
        const user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ message: 'User not found' });

        // Normalize IDs to strings for comparison
        const savedCrops = user.savedCrops.map(id => id.toString());
        const cropIndex = savedCrops.indexOf(cropId);

        if (cropIndex > -1) {
            // Remove
            user.savedCrops.splice(cropIndex, 1);
            await user.save();
            return res.json({ message: 'Crop removed from saved', savedCrops: user.savedCrops, isSaved: false });
        } else {
            // Add
            user.savedCrops.push(cropId);
            await user.save();
            return res.json({ message: 'Crop saved', savedCrops: user.savedCrops, isSaved: true });
        }
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;
