const express = require('express');
const User = require('../models/User');
const { body, validationResult } = require('express-validator');
const bcrypt = require('bcryptjs');
const router = express.Router();
const jwt = require('jsonwebtoken');
const JWT_SECRET = "HARRyisgood";
const fetchuser = require('../middleware/fetchuser');

// Route 1: Create a User using POST "/api/auth/createuser". No login required
router.post('/creteuser', [
    body('name', "Enter a Valid Name.").isLength({ min: 3 }),
    body('email', "Enter a Valid Email.").isEmail(),
    body('password', "Enter a Valid Password of at least 5 characters.").isLength({ min: 1 })
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { name, email, password } = req.body;
        let user = await User.findOne({ email });
        if (user) {
            return res.status(400).json({ error: "A user with this email already exists." });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        user = new User({
            name,
            email,
            password: hashedPassword
        });

        await user.save();

        const payload = { user: { id: user.id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        
        res.json({ success: true, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 2: Authenticate a User using POST "/api/auth/login". No login required
router.post('/login', [
    body('email', "Enter a Valid Email.").isEmail(),
    body('password', "Password cannot be blank.").exists()
], async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }

        const { email, password } = req.body;
        let user = await User.findOne({ email });
        if (!user) {
            return res.status(400).json({ error: "invalid Email" });
        }

        const passwordMatch = await bcrypt.compare(password, user.password);
        if (!passwordMatch) {
            return res.status(400).json({ error: "Invalid Password" });
        }

        const payload = { user: { id: user.id } };
        const authtoken = jwt.sign(payload, JWT_SECRET);
        
        res.json({ success: true, authtoken });
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

// Route 3: Get logged in User details : POST "/api/auth/getuser". login required
router.post('/getuser', fetchuser, async (req, res) => {
    try {
        const user = await User.findById(req.user.id).select("-password");
        res.json(user);
    } catch (error) {
        console.error(error.message);
        res.status(500).send("Internal Server Error");
    }
});

module.exports = router;
