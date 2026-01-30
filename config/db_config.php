<?php
// db_config.php
// This file handles the database connection to MySQL Server.

// MySQL connection details
$serverName = "localhost";       // MySQL host
$username = "root";              // MySQL username
$password = "";                  // MySQL password (leave empty if none)
$database = "hagerbetdb";        // Database name (must exist in MySQL)

// Establish the connection using MySQLi
$conn = mysqli_connect($serverName, $username, $password, $database);

// Check the connection
if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

// Table creation logic (run once, then comment out to avoid duplicate errors)

// For reservations table
$createReservationsTable = "
CREATE TABLE IF NOT EXISTS reservations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    reservation_date DATE NOT NULL,
    reservation_time TIME NOT NULL,
    guests INT NOT NULL,
    customer_name VARCHAR(255),
    customer_email VARCHAR(255),
    status VARCHAR(50) DEFAULT 'booked'
) ENGINE=InnoDB;
";

// For reviews table
$createReviewsTable = "
CREATE TABLE IF NOT EXISTS reviews (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    rating INT NOT NULL CHECK (rating BETWEEN 1 AND 5),
    message TEXT NOT NULL,
    image VARCHAR(255) DEFAULT NULL,
    image_blob LONGTEXT DEFAULT NULL,
    image_type VARCHAR(100) DEFAULT NULL,
    user_id INT DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

// For users table
$createUsersTable = "
CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    display_name VARCHAR(255) DEFAULT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
) ENGINE=InnoDB;
";

// Execute table creation (uncomment for initial setup, then comment out)
// mysqli_query($conn, $createReservationsTable);
// mysqli_query($conn, $createReviewsTable);
// mysqli_query($conn, $createUsersTable);

// Note: In production, close connection at the end of scripts: mysqli_close($conn);
// For included files, it's fine to leave open.
?>
