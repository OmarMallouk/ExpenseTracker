<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);
$username = $_POST['username'] ?? '';

// Check if the username is set and not empty
if (isset($data['username']) && !empty($data['username'])) {
    $username = $data['username'];

    // Check if user already exists
    $checkUserSql = "SELECT * FROM users WHERE username = ?";
    $query = $conn->prepare($checkUserSql);
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'User already exists']);
        exit;
    
    } 
      
    
    // Create new user
        $insertSql = "INSERT INTO users (username) VALUES (?)";
        $query = $conn->prepare($insertSql);
        $query->bind_param("s", $username);

        if ($query->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error creating user']);
        }
    
} else {
    echo json_encode(['success' => false, 'error' => 'Username is required']);
}
?>
