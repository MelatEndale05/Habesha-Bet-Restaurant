<?php
// add_review.php
// This saves new reviews to the DB.

include '../config/db_config.php'; // Include the MySQL connection

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Get form data
    $name = $_POST['name'] ?? '';
    $rating = intval($_POST['rating'] ?? 0);
    $message = $_POST['message'] ?? '';

    // Validation
    if (empty($name) || empty($message) || $rating < 1 || $rating > 5) {
        echo json_encode(['success' => false, 'message' => 'Invalid input.']);
        exit;
    }

    // Handle optional image upload
    $image_path = '';
    if (isset($_FILES['image']) && $_FILES['image']['error'] === UPLOAD_ERR_OK) {
        $fileTmpPath = $_FILES['image']['tmp_name'];
        $fileName = $_FILES['image']['name'];
        $fileSize = $_FILES['image']['size'];
        $fileType = $_FILES['image']['type'];

        $allowedTypes = ['image/jpeg', 'image/png', 'image/gif'];
        $maxSize = 2 * 1024 * 1024; // 2MB

        if (!in_array($fileType, $allowedTypes)) {
            echo json_encode(['success' => false, 'message' => 'Unsupported image type.']);
            exit;
        }
        if ($fileSize > $maxSize) {
            echo json_encode(['success' => false, 'message' => 'Image exceeds 2MB size limit.']);
            exit;
        }

        $uploadDir = __DIR__ . '/../Images/reviews/';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0755, true);
        }

        $ext = pathinfo($fileName, PATHINFO_EXTENSION);
        $newFileName = time() . '_' . bin2hex(random_bytes(6)) . '.' . $ext;
        $destPath = $uploadDir . $newFileName;

        if (move_uploaded_file($fileTmpPath, $destPath)) {
            // Store path relative to this page so frontend can use it
            $image_path = '../Images/reviews/' . $newFileName;
            // Also store base64-encoded image data and mime type for optional DB storage
            $image_blob = base64_encode(file_get_contents($destPath));
            $image_type = $fileType;
        }
    }

    // Insert into DB using prepared statement (include image path + blob + mime type)
    $query = "INSERT INTO reviews (name, rating, message, image, image_blob, image_type) VALUES (?, ?, ?, ?, ?, ?)";
    $stmt = mysqli_prepare($conn, $query);
    // Ensure variables exist even if no image uploaded
    $image_blob = $image_blob ?? null;
    $image_type = $image_type ?? null;
    mysqli_stmt_bind_param($stmt, "sissss", $name, $rating, $message, $image_path, $image_blob, $image_type);

    if (mysqli_stmt_execute($stmt)) {
        echo json_encode(['success' => true, 'message' => 'Review submitted successfully!']);
    } else {
        echo json_encode(['success' => false, 'message' => 'Failed to submit review.']);
    }

    mysqli_close($conn);

} else {
    echo json_encode(['success' => false, 'message' => 'Invalid request.']);
}
?>
