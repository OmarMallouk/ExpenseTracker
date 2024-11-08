<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';

// Getting the POST data
$data = json_decode(file_get_contents("php://input"), true);

// Getting transaction data
$amount = $data['amount'] ?? '';
$description = $data['description'] ?? '';
$type = $data['type'] ?? '';
$user_id = $data['user_id'] ?? '';

if (empty($amount) || empty($description) || empty($type) || empty($user_id)) {
    echo json_encode(['success' => false, 'error' => 'Missing required fields']);
    exit;
}

$sql = "INSERT INTO transactions (amount, description, type, user_id) VALUES (?, ?, ?, ?)";
$query = $conn->prepare($sql);
$query->bind_param("dssi", $amount, $description, $type, $user_id);

if ($query->execute()) {
    echo json_encode(['success' => true, 'transaction_id' => $query->insert_id]);
} else {
    echo json_encode(['success' => false, 'error' => 'Error saving transaction to database']);
}

$query->close();
$conn->close();
?>
