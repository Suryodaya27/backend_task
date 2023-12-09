const { PrismaClient } = require('@prisma/client');

const bcrypt = require('bcrypt');

const prisma = new PrismaClient();

// Define the signup controller function
const signupController = async (req, res) => {
    try {
        // Extract the username, email, and password from the request body
        const { username, email, password } = req.body;

        // Perform necessary validation on the input data
        if (!username || !email || !password) {
            return res.status(400).json({ error: 'Please provide username, email, and password' });
        }

        // Check if the user already exists in the database
        const existingUserByEmail = await prisma.user.findUnique({ where: { email } });
        if (existingUserByEmail) {
            return res.status(409).json({ error: 'User with this email already exists' });
        }

        const existingUserByUsername = await prisma.user.findUnique({ where: { username } });
        if (existingUserByUsername) {
            return res.status(409).json({ error: 'User with this username already exists' });
        }

        // Hash the password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Create a new user with the provided username, email, and hashed password
        const newUser = await prisma.user.create({
            data: {
                username,
                email,
                password: hashedPassword,
            },
        });

        // Return a response indicating successful signup
        res.status(200).json({ message: 'Signup successful', user: newUser });
    } catch (error) {
        // Handle any errors that occur during the signup process
        console.error(error);
        res.status(500).json({ error: 'An error occurred during signup' });
    }
};

// Export the signup controller function
module.exports = signupController;
