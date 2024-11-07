<?php
header("Content-Type: application/json"); 
include 'db_connect.php'; 


$amount = $_POST['amount'];
$type = $_POST['type'];
$description = $_POST['description'];
$date = $_POST['date'];
$notes = isset($_POST['notes']) ? $_POST['notes'] : '';

$sql = "INSERT INTO transactions (amount, type, description, date) VALUES (?, ?, ?, ?, ?)";
$query = $conn->prepare($sql);
$query->bind_param("dssss", $amount, $type, $description, $date);

if ($query->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $query->error]);
}


$query->close();
$conn->close();
?>
