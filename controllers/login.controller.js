const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

const prisma = new PrismaClient();

const loginController = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check if email or username is provided
        if (!email) {
            return res.status(400).json({ error: 'Email or username is required' });
        }

        // Find the user by email
        const userByEmail = await prisma.user.findUnique({
            where: {
                email: email,
            },
        });

        // Find the user by username
        const userByUsername = await prisma.user.findUnique({
            where: {
                username: email,
            },
        });

        // Check if user exists
        if (!userByEmail && !userByUsername) {
            return res.status(404).json({ error: 'User not found' });
        }

        // Compare the provided password with the hashed password
        const user = userByEmail || userByUsername;
        const isPasswordValid = await bcrypt.compare(password, user.password);

        // Check if password is valid
        if (!isPasswordValid) {
            return res.status(401).json({ error: 'Invalid password' });
        }

        // Generate JWT token
        const token = jwt.sign({ userId: user.id }, 'suryodayapandey');

        // Return the token
        return res.json({ token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};

module.exports = loginController;
