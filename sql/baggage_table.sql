-- Run this in the Aiven query console (or MySQL Workbench) once.

CREATE TABLE baggage (
  id INT AUTO_INCREMENT PRIMARY KEY,
  booking_reference VARCHAR(20) NOT NULL,
  passenger_name VARCHAR(100) NOT NULL,
  flight_number VARCHAR(10) NOT NULL,
  weight_kg DECIMAL(5,2) NOT NULL,
  baggage_tag_id VARCHAR(20) UNIQUE DEFAULT NULL,
  status VARCHAR(20) NOT NULL DEFAULT 'Registered',
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
);

-- Optional sample rows for testing the Assign and Track pages:
INSERT INTO baggage (booking_reference, passenger_name, flight_number, weight_kg)
VALUES ('BR10234', 'Amelia Reyes', 'AA101', 18.50);

INSERT INTO baggage (booking_reference, passenger_name, flight_number, weight_kg, baggage_tag_id, status)
VALUES ('BR10298', 'Daniel Osei', 'AA101', 22.00, 'BG-AA101-0042', 'Loaded');
