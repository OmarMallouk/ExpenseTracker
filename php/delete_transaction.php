<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_connect.php";

// Decode JSON input
$data = json_decode(file_get_contents("php://input"), true);

// Check if 'id' is provided
if (isset($data['id'])) {
    $transaction_id = $data['id'];

    // Prepare and execute delete statement
    $query = $conn->prepare("DELETE FROM transactions WHERE id = ?");
    $query->bind_param("i", $transaction_id);

    if ($query->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $query->error]);
    }

    $query->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Transaction ID is required"]);
}
?>