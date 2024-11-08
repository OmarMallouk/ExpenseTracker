<?php
header('Access-Control-Allow-Origin: *');
header('Access-Control-Allow-Methods: GET, POST, PUT, DELETE');
header('Access-Control-Allow-Headers: Content-Type');

include "db_connect.php";

$user_id = $_GET['user_id'];

if (!$user_id) {
    echo json_encode(["error" => "User ID is required"]);
    exit;
}

$sql = "SELECT * FROM transactions WHERE user_id = ?";
$query = $conn->prepare($sql);
$query->bind_param("i", $user_id);
$query->execute();
$result = $query->get_result();

$transactions = [];
while ($row = $result->fetch_assoc()) {
    $transactions[] = $row;
}

echo json_encode($transactions);

$query->close();
$conn->close();
?>