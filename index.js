const http = require('http');
const url = require('url');
const path = require('path');
const fs = require('fs');
const { setupDatabase } = require('./dbSetup');
const sqlite3 = require('sqlite3');
const databasePath = './mydatabase.db';

setupDatabase();

const server = http.createServer((req, res) => {
    const reqUrl = url.parse(req.url, true);

    if (reqUrl.pathname === '/') {
        // serve the login page
        const loginPath = path.join(__dirname, 'public', 'login.html');
        fs.readFile(loginPath, 'utf8', (err, data) => {
            if (err) {
                res.writeHead(500, { 'Content-Type': 'text/plain' });
                res.end('Internal Server Error');
            } else {
                res.writeHead(200, { 'Content-Type': 'text/html' });
                res.end(data);
            }
        });
    } else if (reqUrl.pathname === '/login' && req.method === 'POST') {
        // Handle login form submission
        let body = '';
        req.on('data', chunk => {
            body += chunk.toString();
        });

        req.on('end', () => {
            const formData = new URLSearchParams(body);
            const username = formData.get('username');
            const email = formData.get('email');
            const password = formData.get('password');

            const db = new sqlite3.Database(databasePath);
            const insertQuery = db.prepare('INSERT INTO users (username, email, password) VALUES (?, ?, ?)');

            // Simulate user validation
            // Simulate user validation
const columnName = 'email';
const selectQuery = `SELECT ${columnName} FROM users`;
db.all(selectQuery, (err, rows) => {
    if (err) {
        console.error(err.message);
    } else {
        let loginSuccessful = false;

        rows.forEach(row => {
            const data = row[columnName];
            if (email === data) {
                loginSuccessful = true;
            }
        });

        if (loginSuccessful) {
            res.writeHead(200, { 'Content-Type': 'text/plain' });
            res.end('Login successful');
            insertQuery.run(username, email, password, err => {
                if (err) {
                    console.error(err.message);
                } else {
                    res.writeHead(201, { 'Content-Type': 'application/json' });
                    res.end(JSON.stringify({ message: 'Item added successfully' }));
                }
            });
        } else {
            res.writeHead(401, { 'Content-Type': 'text/plain' });
            res.end('Invalid Credentials');
        }

        
    }
});
// Move db.close() outside of rows.forEach
db.close();

        });
    } else {
        // Serve 404 page for other routes
        res.writeHead(404, { 'Content-Type': 'text/plain' });
        res.end('Not Found');
    }
});

const port = 3000;
server.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
