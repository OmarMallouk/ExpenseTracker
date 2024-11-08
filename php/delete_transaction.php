<?php
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: DELETE");
header("Access-Control-Allow-Headers: Content-Type");

include 'db_connect.php';  

if (isset($_GET['id'])) {
    $transaction_id = $_GET['id'];

    // Checking transaction_id exists
    $sql = "SELECT * FROM transactions WHERE transaction_id = ?";
    $query = $conn->prepare($sql);
    $query->bind_param("i", $transaction_id);
    $query->execute();
    $result = $query->get_result();

    if ($result->num_rows > 0) {
        // Transaction exists
        $deleteSql = "DELETE FROM transactions WHERE transaction_id = ?";
        $deleteTr = $conn->prepare($deleteSql);
        $deleteTr->bind_param("i", $transaction_id);
        if ($deleteTr->execute()) {
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false, 'error' => 'Error deleting transaction']);
        }
    } else {
        echo json_encode(['success' => false, 'error' => 'Transaction not found']);
    }
} else {
    echo json_encode(['success' => false, 'error' => 'Transaction ID not provided']);
}
?>
