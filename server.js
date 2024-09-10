const express = require('express');
const bodyParser = require('body-parser');
const fs = require('fs');
const app = express();
const port = 3000;

// Middleware to parse form data
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public'));

// Load users and scores data
let users = JSON.parse(fs.readFileSync('users.json', 'utf-8'));
let scores = JSON.parse(fs.readFileSync('scores.json', 'utf-8'));

// Registration route
app.post('/register', (req, res) => {
    const { username, password ,contact, name, email } = req.body;

    // Check if user exists
    if (users.some(user => user.username === username)) {
        return res.send('User already exists!');
    }

    // Register new user
    users.push({ username, password, contact, name, email });
    fs.writeFileSync('users.json', JSON.stringify(users, null, 5));
    res.redirect('login.html')
});

// Login route
app.post('/login', (req, res) => {
    const { username, password } = req.body;

    // Validate user credentials
    const user = users.find(user => user.username === username && user.password === password);
    if (user) {
        res.redirect(`/instructions.html?username=${username}`);
    } else {
        res.send('Invalid credentials!');
    }
});

// Submit exam and store score
app.post('/submit_exam', (req, res) => {
    const { username, score } = req.body;

    // Store score
    scores[username] = score;
    fs.writeFileSync('scores.json', JSON.stringify(scores, null, 2));
    res.send(`Exam submitted successfully! Your score: ${score}`);
});

// Start server
app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});
