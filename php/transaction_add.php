<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit();
}

include "db_connect.php";


$data = json_decode(file_get_contents("php://input"), true);


if (isset($data['amount'], $data['type'], $data['description'])) {
    $amount = $data['amount'];
    $type = $data['type'];
    $description = $data['description'];
    $user_id = 1; 

    $conn = new mysqli("localhost", "root", "", "expense_db");

    if ($conn->connect_error) {
        die("Connection failed: " . $conn->connect_error);
    }

    $query = $conn->prepare("INSERT INTO transactions (amount, type, description, user_id) VALUES (?, ?, ?, ?)");

    if ($query === false) {
        die('Prepare failed: ' . $conn->error); 
    }


    $query->bind_param("dssi", $amount, $type, $description, $user_id);

    if ($query->execute()) {
        echo json_encode(["success" => true]);
    } else {
        echo json_encode(["success" => false, "error" => $query->error]);
    }

    $query->close();
    $conn->close();
} else {
    echo json_encode(["success" => false, "error" => "Missing data"]);
}
?>
