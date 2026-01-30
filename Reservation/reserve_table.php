<?php
// reserve_table.php
// This handles reservation verification, availability check, suggestions, saving to DB, and notification.

include '../config/db_config.php'; // Include the MySQL connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $date = $_POST['date'] ?? '';
    $time = $_POST['time'] ?? '';
    $guests = intval($_POST['guests'] ?? 0);
    $customer_name= $_POST['name'] ?? '';
    $customer_email= $_POST['email'] ?? '';

    // Basic validation
    if (empty($date) || empty($time) || $guests < 1) {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
        exit;
    }

    $maxTables = 10; // Assume a total of 10 tables available

    // Check current bookings for the same date and time
    $checkQuery = "
        SELECT COUNT(*) AS booked_count
        FROM reservations
        WHERE reservation_date = ? AND reservation_time = ? AND status = 'booked'
    ";

    $stmt = mysqli_prepare($conn, $checkQuery);
    mysqli_stmt_bind_param($stmt, "ss", $date, $time);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $row = mysqli_fetch_assoc($result);
    $booked = $row['booked_count'] ?? 0;

    if ($booked < $maxTables) {
        // Available: insert reservation
        $insertQuery = "
            INSERT INTO reservations (reservation_date, reservation_time, guests, customer_name, customer_email)
            VALUES (?, ?, ?, ?,?)
        ";
        $insertStmt = mysqli_prepare($conn, $insertQuery);
        mysqli_stmt_bind_param($insertStmt, "ssiss", $date, $time, $guests, $customer_name, $customer_email);

        if (mysqli_stmt_execute($insertStmt)) {
            echo json_encode(['success' => true, 'message' => 'Reservation booked successfully!']);
        } else {
            echo json_encode(['success' => false, 'message' => 'Failed to book.']);
        }

    } else {
        // Not available: suggest alternative times
        $suggestQuery = "
            SELECT reservation_time, 
                   (SELECT COUNT(*) FROM reservations r2 
                    WHERE r2.reservation_date = r.reservation_date 
                    AND r2.reservation_time = r.reservation_time 
                    AND r2.status = 'booked') AS booked_count
            FROM reservations r
            WHERE reservation_date = ?
            GROUP BY reservation_time
            HAVING booked_count < ?
            ORDER BY reservation_time
        ";

        $suggestStmt = mysqli_prepare($conn, $suggestQuery);
        mysqli_stmt_bind_param($suggestStmt, "si", $date, $maxTables);
        mysqli_stmt_execute($suggestStmt);
        $suggestResult = mysqli_stmt_get_result($suggestStmt);

        $alternatives = [];
        while ($suggestRow = mysqli_fetch_assoc($suggestResult)) {
            $alternatives[] = $suggestRow['reservation_time'];
        }

        if (!empty($alternatives)) {
            $message = 'Selected time is not available. Alternatives: ' . implode(', ', $alternatives);
        } else {
            $message = 'No available times on this day.';
        }

        echo json_encode(['success' => false, 'message' => $message]);
    }

    mysqli_close($conn);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
