<?php
session_start();
require_once __DIR__ . '/../Controller/db.php';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'];
    $password = $_POST['password'];

    $hashedPassword = password_hash($password, PASSWORD_DEFAULT);

    $query = "INSERT INTO users (username, password) VALUES ('$username', '$hashedPassword')";
    $result = mysqli_query($conn, $query);
    $_SESSION['username'] = $username;

    if ($result) {
        $_SESSION['username'] = $username;
        echo '{"success":true}';
    } else {
        echo '{"success":false}';
    }
} else {
    echo '{"success":false}';
}

mysqli_close($conn);
?>
