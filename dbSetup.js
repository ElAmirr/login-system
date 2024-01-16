const sqlite3 = require('sqlite3').verbose();
const fs = require('fs');

const databasePath = 'mydatabase.db';

function setupDatabase() {
    if(!fs.existsSync(databasePath)) {
        const db = new sqlite3.Database(databasePath);
        db.serialize(() => {
            db.run('CREATE TABLE users (id INTEGER PRIMARY KEY AUTOINCREMENT, username TEXT, email TEXT, password TEXT)', (err) => {
                if (err) {
                    console.error('Error crating table', err);
                } else {
                    console.log('Table created successfully');
                }
                db.close();
            });
        });
    }
}

module.exports = { setupDatabase }