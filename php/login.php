<?php
header("Content-Type: application/json");
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, GET");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php'; 

$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';

if (empty($username)) {
    echo json_encode(['success' => false, 'error' => 'Username is required']);
    exit;
}

// Query to check if the user exists
$sql = "SELECT * FROM users WHERE username = ?";
$query = $conn->prepare($sql);
$query->bind_param("s", $username);
$query->execute();
$result = $query->get_result();

if ($result->num_rows > 0) {
    // User exists
    echo json_encode(['success' => true, 'message' => 'User exists']);
} else {
    // User doesn't exist
    echo json_encode(['success' => false, 'error' => 'User not found']);
}

$query->close();
$conn->close();
?>
