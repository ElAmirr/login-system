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

// Insert initial user (admin/admin) into the database
const hashedPassword = bcrypt.hashSync('admin', 10);
db.run('INSERT OR IGNORE INTO users (username, password) VALUES (?, ?)', ['admin', hashedPassword]);

// Routes
app.get('/', (req, res) => {
  res.sendFile(__dirname + '/public/index.html');
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
