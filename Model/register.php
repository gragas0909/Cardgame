<?php
session_start();
require_once __DIR__ . '/../Controller/db.php';
require_once __DIR__ . '/UserORM.php';

$userORM = new UserORM($conn);

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = $_POST['username'] ?? '';
    $password = $_POST['password'] ?? '';

    if (!empty($username) && !empty($password)) {
        $success = $userORM->create(['username' => $username, 'password' => $password]);

        if ($success) {
            $_SESSION['username'] = $username;
            echo '{"success":true}';
        } else {
            echo '{"success":false, "error":"' . mysqli_error($conn) . '"}';
        }
    } else {
        echo '{"success":false, "error":"Missing username or password"}';
    }
} else {
    echo '{"success":false, "error":"Invalid request method"}';
}

mysqli_close($conn);
?>
