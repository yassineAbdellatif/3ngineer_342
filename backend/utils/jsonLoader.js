const { initDatabase } = require('../config/database');

/**
 * Get database instance (singleton pattern with automatic table creation)
 */
async function getDatabase() {
  // initDatabase now automatically creates tables if they don't exist
  return await initDatabase();
}

/**
 * Load connections from database
 */
async function loadConnectionsCatalog() {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    const query = 'SELECT COUNT(*) as count FROM routes';
    
    db.get(query, [], (err, row) => {
      if (err) {
        console.error('Error loading connections catalog:', err.message);
        reject(err);
      } else {
        resolve({
          metadata: {
            totalConnections: row.count
          }
        });
      }
    });
  });
}

/**
 * Filter connections based on search query
 */
async function filterConnections(query) {
  const db = await getDatabase();
  
  const {
    departure = "",
    arrival = "",
    trainType = "",
    daysOfOperation = "",
    maxPrice = ""
  } = query;

  let sql = 'SELECT * FROM routes WHERE 1=1';
  const params = [];

  // Filter by departure city
  if (departure) {
    sql += ' AND departure_city LIKE ?';
    params.push(`%${departure}%`);
  }

  // Filter by arrival city
  if (arrival) {
    sql += ' AND arrival_city LIKE ?';
    params.push(`%${arrival}%`);
  }

  // Filter by train type
  if (trainType) {
    sql += ' AND train_type LIKE ?';
    params.push(`%${trainType}%`);
  }

  // Filter by days of operation
  if (daysOfOperation) {
    sql += ' AND days_of_operation LIKE ?';
    params.push(`%${daysOfOperation}%`);
  }

  // Filter by max price (second class)
  if (maxPrice) {
    sql += ' AND second_class_rate <= ?';
    params.push(parseFloat(maxPrice));
  }

  return new Promise((resolve, reject) => {
    db.all(sql, params, (err, rows) => {
      if (err) {
        console.error('Error querying routes:', err.message);
        reject(err);
      } else {
        // Transform database rows to match previous format
        const results = rows.map(row => ({
          routeId: row.route_id,
          departureCity: row.departure_city,
          arrivalCity: row.arrival_city,
          departureTime: row.departure_time,
          arrivalTime: row.arrival_time,
          trainType: row.train_type,
          daysOfOperation: row.days_of_operation,
          firstClassPrice: row.first_class_rate,
          secondClassPrice: row.second_class_rate
        }));
        
        resolve(results);
      }
    });
  });
}

/**
 * Get route by ID
 */
async function getRouteById(routeId) {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.get(
      'SELECT * FROM routes WHERE route_id = ?',
      [routeId],
      (err, row) => {
        if (err) {
          reject(err);
        } else if (!row) {
          resolve(null);
        } else {
          resolve({
            routeId: row.route_id,
            departureCity: row.departure_city,
            arrivalCity: row.arrival_city,
            departureTime: row.departure_time,
            arrivalTime: row.arrival_time,
            trainType: row.train_type,
            daysOfOperation: row.days_of_operation,
            firstClassPrice: row.first_class_rate,
            secondClassPrice: row.second_class_rate
          });
        }
      }
    );
  });
}

/**
 * Get all unique cities
 */
async function getAllCities() {
  const db = await getDatabase();
  
  return new Promise((resolve, reject) => {
    db.all(`
      SELECT DISTINCT departure_city as city FROM routes
      UNION
      SELECT DISTINCT arrival_city as city FROM routes
      ORDER BY city
    `, [], (err, rows) => {
      if (err) {
        reject(err);
      } else {
        resolve(rows.map(row => row.city));
      }
    });
  });
}

module.exports = { 
  loadConnectionsCatalog, 
  filterConnections,
  getRouteById,
  getAllCities,
  getDatabase
};
