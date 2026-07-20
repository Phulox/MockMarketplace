require('dotenv').config();
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const express = require('express');
const app = express();

function authenticateToken(req,res,next) {
    const authHeader = req.headers['authorization'];
    const token = authHeader && authHeader.split(' ')[1];
    if (!token) {
        return res.status(401).json({ error: 'Token is required' });
    }
    jwt.verify(token, process.env.SECRET_KEY, (err, user) => {
        if (err) {
            return res.status(403).json({ error: 'Invalid token' });
        }
        req.user = user;
        next();
    });
}

app.use(express.json());

app.use((req, res, next) => {
    console.log(`${req.method} ${req.url}`)
    next();
});

let users = [];
let nextID = 1;

// Basic route to check if the server is running
app.get('/', (req, res) => res.send('Welcome to MockMarketplace'));

// ====== CRUD operations for users ====
app.post('/users', (req, res) => {
    const {name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({ error: 'Name and email are required' });
    }
    const newUser = {id: nextID++, name, email};
    users.push(newUser);
    res.status(201).json(newUser);
});

app.get('/users', (req, res) => {
    res.json(users);
});

app.get('/users/:id',authenticateToken, (req, res) => {
    const id = parseInt(req.params.id)
    if (isNaN(id)){
        return res.status(400).json(
            {error: "Invalid user ID"}
        )
    }
    const user = users.find(u => u.id === parseInt(req.params.id));
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }
    res.json({id: user.id, name: user.name, email: user.email});
});

app.put('/users/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);

     if (isNaN(id)){
        return res.status(400).json({error: "Invalid user ID"})
    }

    const user = users.find(u => u.id === id);
    
    if (!user) {
        return res.status(404).json({ error: 'User not found' });
    }

    if (!req.user || req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ error: 'You can only update your own account' });
    }
    const {name, email} = req.body;
    if (!name || !email) {
        return res.status(400).json({error: 'Name and email are required' });
    }
    user.name = name;
    user.email = email;
    res.json(user);
});

app.delete('/users/:id', authenticateToken, (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)){
        return res.status(400).json({error: 'Invalid user ID'});
    }
    const userIndex = users.findIndex(u => u.id === parseInt(req.params.id));
    if (userIndex === -1) {
        return res.status(404).json({ error: 'User not found' });
    }
     if (!req.user || req.user.id !== parseInt(req.params.id)) {
        return res.status(403).json({ error: 'You can only delete your own account' });
    }
    users.splice(userIndex, 1);
    res.status(204).send();
});

// ====== Auth routes ======

app.post('/signup', async (req,res) => {

    try {
    const {name, email, password} = req.body;
    if (!name || !email || !password) {
        return res.status(400).json({ error: 'Name, email, and password are required' });
    }
    
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = {id: nextID++, name, email, password: hashedPassword};
    users.push(newUser);
    res.status(201).json({id: newUser.id, name: newUser.name, email: newUser.email});
}
    catch (err) {
    res.status(500).json({error: "Something went wrong"})
}

})

app.post('/login', async (req,res) => {
    try {
    const {email, password} = req.body;
    if (!email || !password) {
        return res.status(400).json({ error: 'Email and password are required' });
    }
    // Check and find the user by email
    const user = users.find(p => p.email === email)
    if (!user) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
        return res.status(401).json({ error: 'Invalid email or password' });
    }
    const payload = {id: user.id, email: user.email};
    const token = jwt.sign( payload, process.env.SECRET_KEY, {expiresIn: '1h'} );


    res.json({ message: 'Login successful', token });
    }
    catch (err) {
        res.status(500).json({error: "Something went wrong"})
    }
});


app.use((req, res) => {
    res.status(404).json({ error: 'Route Not Found' });
});

app.listen(3000, () => console.log('Server running on port 3000'));