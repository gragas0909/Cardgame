<?php
session_start();
require_once __DIR__ . '/../Controller/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $query = "SELECT * FROM users WHERE username = '$username'";
    $result = mysqli_query($conn, $query);

    if ($result) {
        $user = mysqli_fetch_assoc($result);
        if (password_verify($password, $user['password'])) {
            $_SESSION['username'] = $username;
            echo json_encode(['success' => true]);
        } else {
            echo json_encode(['success' => false]);
        }
    } else {
        echo json_encode(['success' => false]);
    }
} else {
    echo json_encode(['success' => false]);
}

mysqli_close($conn);
?>
