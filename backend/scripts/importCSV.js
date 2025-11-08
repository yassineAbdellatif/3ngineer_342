const fs = require('fs');
const path = require('path');
const { parse } = require('csv-parse');
const { initDatabase, closeDatabase } = require('../config/database');

const CSV_PATH = path.join(__dirname, '../data/train_connections.csv');

/**
 * Import CSV data into SQLite database
 */
async function importCSVToDatabase() {
    const db = await initDatabase();
    
    return new Promise((resolve, reject) => {
        const routes = [];
        
        fs.createReadStream(CSV_PATH)
            .pipe(parse({
                columns: true,
                skip_empty_lines: true,
                trim: true
            }))
            .on('data', (row) => {
                routes.push({
                    routeId: row['Route ID'],
                    departureCity: row['Departure City'],
                    arrivalCity: row['Arrival City'],
                    departureTime: row['Departure Time'],
                    arrivalTime: row['Arrival Time'],
                    trainType: row['Train Type'],
                    daysOfOperation: row['Days of Operation'],
                    firstClassRate: parseFloat(row['First Class ticket rate (in euro)']),
                    secondClassRate: parseFloat(row['Second Class ticket rate (in euro)'])
                });
            })
            .on('end', async () => {
                console.log(`Parsed ${routes.length} routes from CSV`);
                
                // Insert routes into database
                const stmt = db.prepare(`
                    INSERT OR REPLACE INTO routes (
                        route_id, departure_city, arrival_city, 
                        departure_time, arrival_time, train_type, 
                        days_of_operation, first_class_rate, second_class_rate
                    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
                `);
                
                let inserted = 0;
                for (const route of routes) {
                    stmt.run(
                        route.routeId,
                        route.departureCity,
                        route.arrivalCity,
                        route.departureTime,
                        route.arrivalTime,
                        route.trainType,
                        route.daysOfOperation,
                        route.firstClassRate,
                        route.secondClassRate,
                        (err) => {
                            if (err) {
                                console.error(`Error inserting route ${route.routeId}:`, err.message);
                            } else {
                                inserted++;
                            }
                        }
                    );
                }
                
                stmt.finalize(async (err) => {
                    if (err) {
                        console.error('Error finalizing statement:', err.message);
                        reject(err);
                    } else {
                        console.log(`✓ Successfully imported ${inserted} routes into database`);
                        await closeDatabase(db);
                        resolve(inserted);
                    }
                });
            })
            .on('error', (error) => {
                console.error('Error reading CSV:', error.message);
                reject(error);
            });
    });
}

// Run import if called directly
if (require.main === module) {
    importCSVToDatabase()
        .then(() => {
            console.log('Import completed successfully');
            process.exit(0);
        })
        .catch((error) => {
            console.error('Import failed:', error);
            process.exit(1);
        });
}

module.exports = { importCSVToDatabase };
