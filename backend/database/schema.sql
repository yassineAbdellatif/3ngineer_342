-- Train Routes Table
CREATE TABLE IF NOT EXISTS routes (
    route_id TEXT PRIMARY KEY,
    departure_city TEXT NOT NULL,
    arrival_city TEXT NOT NULL,
    departure_time TEXT NOT NULL,
    arrival_time TEXT NOT NULL,
    train_type TEXT NOT NULL,
    days_of_operation TEXT NOT NULL,
    first_class_rate REAL NOT NULL,
    second_class_rate REAL NOT NULL
);

-- Indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_departure_city ON routes(departure_city);
CREATE INDEX IF NOT EXISTS idx_arrival_city ON routes(arrival_city);
CREATE INDEX IF NOT EXISTS idx_train_type ON routes(train_type);
CREATE INDEX IF NOT EXISTS idx_route_pair ON routes(departure_city, arrival_city);
