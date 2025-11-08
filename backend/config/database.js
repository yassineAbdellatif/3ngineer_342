const sqlite3 = require('sqlite3').verbose();
const path = require('path');
const fs = require('fs');

const DB_PATH = path.join(__dirname, '../data/train_connections.db');
const SCHEMA_PATH = path.join(__dirname, '../database/schema.sql');

let dbInstance = null;

async function initDatabase() {
    if (dbInstance) {
        return dbInstance;
    }

    return new Promise((resolve, reject) => {
        // Ensure data directory exists
        const dataDir = path.dirname(DB_PATH);
        if (!fs.existsSync(dataDir)) {
            fs.mkdirSync(dataDir, { recursive: true });
        }

        const db = new sqlite3.Database(DB_PATH, async (err) => {
            if (err) {
                console.error('Error opening database:', err.message);
                reject(err);
            } else {                
                try {
                    // Create tables immediately after connection
                    await createTables(db);
                    dbInstance = db;
                    resolve(db);
                } catch (error) {
                    reject(error);
                }
            }
        });
    });
}

async function createTables(db) {
    return new Promise((resolve, reject) => {
        if (!fs.existsSync(SCHEMA_PATH)) {
            console.error('Schema file not found:', SCHEMA_PATH);
            reject(new Error('Schema file not found'));
            return;
        }

        const schema = fs.readFileSync(SCHEMA_PATH, 'utf8');
        
        db.exec(schema, (err) => {
            if (err) {
                console.error('Error creating tables:', err.message);
                reject(err);
            } else {
                resolve();
            }
        });
    });
}

function closeDatabase(db) {
    return new Promise((resolve, reject) => {
        if (!db) {
            resolve();
            return;
        }

        db.close((err) => {
            if (err) {
                console.error('Error closing database:', err.message);
                reject(err);
            } else {
                console.log('✓ Database connection closed');
                dbInstance = null;
                resolve();
            }
        });
    });
}

function resetDatabaseInstance() {
    dbInstance = null;
}

module.exports = {
    initDatabase,
    createTables,
    closeDatabase,
    resetDatabaseInstance,
    DB_PATH
};
