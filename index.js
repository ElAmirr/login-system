const express = require('express');
const sqlite3 = require('sqlite3');
const bodyParser = require('body-parser');
const bcrypt = require('bcrypt');

const app = express();
const port = 3000;

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static('public')); // for serving HTML and CSS files

// SQLite Database
const db = new sqlite3.Database('database.db');

// Create users table if not exists
db.run(`
  CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT UNIQUE,
    password TEXT
  )
`);

// Routes
app.get('/login', (req, res) => {
  res.sendFile(__dirname + '/public/login.html');
});

app.get('/signup', (req, res) => {
  res.sendFile(__dirname + '/public/signup.html');
});

app.post('/signup', (req, res) => {
  const { username, password } = req.body;

  // Check if the username already exists
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (row) {
      res.send('Username already exists. Please choose a different username.');
    } else {
      // Hash the password before storing it in the database
      const hashedPassword = bcrypt.hashSync(password, 10);

      // Insert user into the database
      db.run('INSERT INTO users (username, password) VALUES (?, ?)', [username, hashedPassword], (err) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else {
          res.send('Registration successful! You can now log in.');
        }
      });
    }
  });
});

app.post('/login', (req, res) => {
  const { username, password } = req.body;

  // Retrieve user from the database
  db.get('SELECT * FROM users WHERE username = ?', [username], (err, row) => {
    if (err) {
      console.error(err);
      res.status(500).send('Internal Server Error');
    } else if (row) {
      // Compare hashed password
      bcrypt.compare(password, row.password, (err, result) => {
        if (err) {
          console.error(err);
          res.status(500).send('Internal Server Error');
        } else if (result) {
          res.send('Login successful!');
        } else {
          res.send('Invalid username or password');
        }
      });
    } else {
      res.send('Invalid username or password');
    }
  });
});

// Start the server
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
