<?php
$conn = mysqli_connect('localhost', 'root', '', 'cardgame');

if (!$conn) {
    die('Connection failed: ' . mysqli_connect_error());
}
?>
