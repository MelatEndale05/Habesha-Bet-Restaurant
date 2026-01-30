<?php
include '../config/db_config.php';

$query = "SELECT name, rating, message, image, image_blob, image_type FROM reviews ORDER BY created_at DESC";
$stmt = mysqli_prepare($conn, $query);

if (!$stmt) {
    echo json_encode(['success' => false, 'message' => 'Database error: ' . mysqli_error($conn)]);
    exit;
}

mysqli_stmt_execute($stmt);
$result = mysqli_stmt_get_result($stmt);

$reviews = [];
while ($row = mysqli_fetch_assoc($result)) {
    $reviews[] = [
        'name' => $row['name'],
        'rating' => $row['rating'],
        'message' => $row['message'],
        'image' => isset($row['image']) ? $row['image'] : '',
        'image_blob' => isset($row['image_blob']) ? $row['image_blob'] : '',
        'image_type' => isset($row['image_type']) ? $row['image_type'] : ''
    ];
}

echo json_encode($reviews);
mysqli_close($conn);
?>
