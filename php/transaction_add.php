<?php
header("Content-Type: application/json"); 
include 'db_connect.php'; 


$amount = $_POST['amount'];
$type = $_POST['type'];
$category = $_POST['category'];
$date = $_POST['date'];
$notes = isset($_POST['notes']) ? $_POST['notes'] : '';

// Prepare and execute the SQL statement to insert the transaction
$sql = "INSERT INTO transactions (amount, type, category, date, notes) VALUES (?, ?, ?, ?, ?)";
$stmt = $conn->prepare($sql);
$stmt->bind_param("dssss", $amount, $type, $category, $date, $notes);

if ($stmt->execute()) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "error" => $stmt->error]);
}

// Close the connection
$stmt->close();
$conn->close();
?>
