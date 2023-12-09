const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const app = express();
app.use(bodyParser.json());
app.use(cors());

const { PrismaClient } = require("@prisma/client");
const prisma = new PrismaClient();

app.get('/', (req, res) => {
    res.send('Hello World!');
});

const signup = require('./routes/signup.route');
const login = require('./routes/login.route');

app.use('/api', signup); 
app.use('/api', login);

app.listen(8080, () => console.log('Server running on port 8080'));