
const express = require('express');
const router = express.Router();
const User = require('../models/User');

// @route   POST api/auth/register
// @desc    Register user
// @access  Public
router.post('/register', async (req, res) => {
    const { name, email, password, phone, role, organization } = req.body;

    try {
        // Check if user exists
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ msg: 'User already exists' });
        }

        // Create new user
        user = new User({
            name,
            email,
            password,
            phone,
            role,
            organization
        });

        await user.save();

        res.json({ msg: 'User registered successfully', user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
    const { email, password, role } = req.body;

    try {
        // Check for user
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate password (plain text comparison for now)
        if (password !== user.password) {
            return res.status(400).json({ msg: 'Invalid Credentials' });
        }

        // Validate role (optional, but good for security)
        if (user.role !== role) {
            return res.status(400).json({ msg: 'Invalid Role for this user' });
        }

        const payload = {
            user: {
                id: user.id
            }
        };

        // Return user data along with token (simplified for this demo)
        res.json({ token: "dummy-token", user });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/auth/sync
// @desc    Sync Clerk user with MongoDB
// @access  Public
router.post('/sync', async (req, res) => {
    const { clerkId, email, name, role, phone } = req.body;

    try {
        // 1. Try to find by Clerk ID
        let user = await User.findOne({ clerkId });

        if (user) {
            // Update role if user is logging in from a different portal
            if (role && user.role !== role) {
                user.role = role;
                await user.save();
            }
            return res.json({ user });
        }

        // 2. Try to find by Email (linking legacy accounts)
        user = await User.findOne({ email });

        if (user) {
            // Update existing user with Clerk ID and NEW ROLE (if changed)
            user.clerkId = clerkId;
            if (role) user.role = role; // <--- CRITICAL FIX: Allow role switching
            await user.save();
            return res.json({ user });
        }

        // 3. Create new user
        user = new User({
            clerkId,
            name,
            email,
            role,
            phone: phone || "000-000-0000", // Placeholder if not provided
            password: "clerk_authenticated", // Placeholder
            organization: "",
            location: "",
            bio: ""
        });

        await user.save();
        res.json({ user });

    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/auth/update/:id
// @desc    Update user profile
// @access  Public (should be private)
router.put('/update/:id', async (req, res) => {
    const { name, email, phone, organization, location, farmSize, bio } = req.body;

    // Build user object
    const userFields = {};
    if (name) userFields.name = name;
    if (email) userFields.email = email;
    if (phone) userFields.phone = phone;
    if (organization) userFields.organization = organization;
    if (location) userFields.location = location;
    if (farmSize) userFields.farmSize = farmSize;
    if (bio) userFields.bio = bio;
    if (req.body.latitude) userFields.latitude = req.body.latitude;
    if (req.body.longitude) userFields.longitude = req.body.longitude;

    try {
        let user = await User.findById(req.params.id);

        if (!user) return res.status(404).json({ msg: 'User not found' });

        user = await User.findByIdAndUpdate(
            req.params.id,
            { $set: userFields },
            { new: true }
        );

        res.json(user);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
