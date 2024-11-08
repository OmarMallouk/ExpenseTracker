<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: POST");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';
$data = json_decode(file_get_contents("php://input"), true);
$username = $data['username'] ?? '';
$password = $data['password'] ?? '';

if (empty($username) || empty($password)) {
    echo json_encode(['success' => false, 'error' => 'Username and password are required']);
    exit;
}

    $checkUserSql = "SELECT * FROM users WHERE username = ?";
    $query = $conn->prepare($checkUserSql);
    $query->bind_param("s", $username);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        echo json_encode(['success' => false, 'error' => 'User already exists']);
    } else {
        
        $hashedPassword = password_hash($password, PASSWORD_DEFAULT);
      
        $insertSql = "INSERT INTO users (username, password) VALUES (?, ?)";
        $insertQuery = $conn->prepare($insertSql);
        $insertQuery->bind_param("ss", $username, $hashedPassword);

        if ($insertQuery->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error creating user']);
        }
    
        $insertQuery->close();
    }
    
    $query->close();
    $conn->close();
    ?>