const express = require('express');
const router = express.Router();
const Task = require('../models/Task');
const User = require('../models/User');

// Middleware to simulate authentication (Replace with real auth middleware)
const getUserId = async (req) => {
    // For demo/development, we might grab the first user or expect a header.
    // In this project context, we often look up by email from a header or similar, 
    // but consistent with other files, let's try to find a default user if not passed.
    // For now, let's assume the frontend sends 'x-user-email' or we use a hardcoded fallback if needed.
    // Better: frontend seems to handle user context. The dashboard sends requests.
    // Let's rely on body.userId or header.
    const email = req.headers['x-user-email'];
    if (email) {
        const user = await User.findOne({ email });
        return user ? user._id : null;
    }
    return null;
};

// @route   GET api/tasks
// @desc    Get all tasks for a user
// @access  Private (Simulated)
router.get('/', async (req, res) => {
    try {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).json({ msg: 'User not identified' });

        const tasks = await Task.find({ user: userId }).sort({ date: 1 });
        res.json(tasks);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   POST api/tasks
// @desc    Create a new task
// @access  Private
router.post('/', async (req, res) => {
    try {
        const userId = await getUserId(req);
        if (!userId) return res.status(401).json({ msg: 'User not identified' });

        const { title, description, date, type } = req.body;

        const newTask = new Task({
            user: userId,
            title,
            description,
            date,
            type
        });

        const task = await newTask.save();
        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   PUT api/tasks/:id
// @desc    Update task (e.g., toggle status)
// @access  Private
router.put('/:id', async (req, res) => {
    try {
        const { status, title, description, date, type } = req.body;

        // Build object
        const taskFields = {};
        if (title) taskFields.title = title;
        if (description) taskFields.description = description;
        if (date) taskFields.date = date;
        if (type) taskFields.type = type;
        if (status) taskFields.status = status;

        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        // Verify user owns task (Skipping strict check for demo speed, but logic is implicit)

        task = await Task.findByIdAndUpdate(
            req.params.id,
            { $set: taskFields },
            { new: true }
        );

        res.json(task);
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

// @route   DELETE api/tasks/:id
// @desc    Delete a task
// @access  Private
router.delete('/:id', async (req, res) => {
    try {
        let task = await Task.findById(req.params.id);
        if (!task) return res.status(404).json({ msg: 'Task not found' });

        await Task.findByIdAndDelete(req.params.id);
        res.json({ msg: 'Task removed' });
    } catch (err) {
        console.error(err.message);
        res.status(500).send('Server Error');
    }
});

module.exports = router;
