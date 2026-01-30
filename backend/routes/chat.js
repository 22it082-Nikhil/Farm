const express = require('express');
const router = express.Router();
const Message = require('../models/Message');
const Offer = require('../models/Offer');
const User = require('../models/User');

// Middleware to get user from clerkId (simplified for now, assuming frontend sends clerkId in headers or body effectively, 
// strictly speaking we should use the existing auth logic if available, but for now I'll lookup user by clerkId passed in headers)
// In previous tasks we might have established a pattern. Let's assume the frontend will send `x-clerk-user-id`.
const getUser = async (req, res, next) => {
    const clerkId = req.headers['x-clerk-user-id'];
    if (!clerkId) return res.status(401).json({ message: 'Unauthorized' });

    try {
        const user = await User.findOne({ clerkId });
        if (!user) return res.status(404).json({ message: 'User not found' });
        req.user = user;
        next();
    } catch (error) {
        res.status(500).json({ message: 'Server Error' });
    }
};

// GET /api/chat/contacts - Get list of users to chat with (based on Bids/Offers)
router.get('/contacts', getUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const userRole = req.user.role.toLowerCase();
        console.log(`[Chat] Fetching contacts for User: ${userId}, Role: ${userRole}`);

        // Unified Logic: Find ALL offers where this user is involved (as Farmer, Buyer, or Provider)
        // This decouples chat from the static 'role' field and bases it on actual interactions.
        const offers = await Offer.find({
            $or: [
                { farmer: userId },
                { buyer: userId },
                { provider: userId }
            ]
        })
            .populate('farmer', 'name email _id')
            .populate('buyer', 'name email _id')
            .populate('provider', 'name email _id');

        console.log(`[Chat] Found ${offers.length} total interactions for User ${userId}`);

        offers.forEach(offer => {
            // Case 1: I am the Farmer
            if (offer.farmer && offer.farmer._id.toString() === userId.toString()) {
                // Add Buyer (if crop offer)
                if (offer.buyer && !contactIds.has(offer.buyer._id.toString())) {
                    contactIds.add(offer.buyer._id.toString());
                    contacts.push(offer.buyer);
                }
                // Add Provider (if service offer)
                if (offer.provider && !contactIds.has(offer.provider._id.toString())) {
                    contactIds.add(offer.provider._id.toString());
                    contacts.push(offer.provider);
                }
            }

            // Case 2: I am the Buyer (bidding on crops)
            if (offer.buyer && offer.buyer._id.toString() === userId.toString()) {
                // Add Farmer
                if (offer.farmer && !contactIds.has(offer.farmer._id.toString())) {
                    contactIds.add(offer.farmer._id.toString());
                    contacts.push(offer.farmer);
                }
            }

            // Case 3: I am the Service Provider (bidding on requests)
            if (offer.provider && offer.provider._id.toString() === userId.toString()) {
                // Add Farmer (requester)
                if (offer.farmer && !contactIds.has(offer.farmer._id.toString())) {
                    contactIds.add(offer.farmer._id.toString());
                    contacts.push(offer.farmer);
                }
            }
        });

        console.log(`[Chat] Found ${contacts.length} unique contacts`);

        // Add last message info for UI polish (optional but good)
        const contactsWithMeta = await Promise.all(contacts.map(async (contact) => {
            const lastMsg = await Message.findOne({
                $or: [
                    { sender: userId, receiver: contact._id },
                    { sender: contact._id, receiver: userId }
                ]
            }).sort({ createdAt: -1 });

            // Count unread
            const unreadCount = await Message.countDocuments({
                sender: contact._id,
                receiver: userId,
                read: false
            });

            return {
                _id: contact._id,
                name: contact.name,
                email: contact.email,
                lastMessage: lastMsg ? lastMsg.content : null,
                lastMessageTime: lastMsg ? lastMsg.createdAt : null,
                unreadCount
            };
        }));

        res.json(contactsWithMeta);
    } catch (error) {
        console.error('Error fetching contacts:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// GET /api/chat/messages/:contactId - Get conversation
router.get('/messages/:contactId', getUser, async (req, res) => {
    try {
        const userId = req.user._id;
        const contactId = req.params.contactId;

        const messages = await Message.find({
            $or: [
                { sender: userId, receiver: contactId },
                { sender: contactId, receiver: userId }
            ]
        }).sort({ createdAt: 1 });

        // Mark as read
        await Message.updateMany(
            { sender: contactId, receiver: userId, read: false },
            { read: true }
        );

        res.json(messages);
    } catch (error) {
        console.error('Error fetching messages:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

// POST /api/chat/messages - Send a message
router.post('/messages', getUser, async (req, res) => {
    try {
        const { receiverId, content } = req.body;
        const senderId = req.user._id;

        const newMessage = new Message({
            sender: senderId,
            receiver: receiverId,
            content
        });

        const savedMessage = await newMessage.save();
        res.status(201).json(savedMessage);
    } catch (error) {
        console.error('Error sending message:', error);
        res.status(500).json({ message: 'Server error' });
    }
});

module.exports = router;
