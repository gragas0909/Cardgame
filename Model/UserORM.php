<?php
require_once __DIR__ . '/../Controller/db.php';
require_once __DIR__ . '/CRUDInterface.php';

class UserORM implements CRUDInterface {
    private $conn;

    public function __construct($dbConnection) {
        $this->conn = $dbConnection;
    }

    public function create($data) {
        $username = mysqli_real_escape_string($this->conn, $data['username']);
        $password = password_hash($data['password'], PASSWORD_DEFAULT);

        $query = "INSERT INTO users (username, password) VALUES ('$username', '$password')";
        return mysqli_query($this->conn, $query);
    }

    public function read($id) {
        $id = intval($id);
        $result = mysqli_query($this->conn, "SELECT * FROM users WHERE id = $id");
        return mysqli_fetch_assoc($result);
    }

    public function update($id, $data) {
        $username = mysqli_real_escape_string($this->conn, $data['username']);
        $id = intval($id);
        $query = "UPDATE users SET username = '$username' WHERE id = $id";
        return mysqli_query($this->conn, $query);
    }

    public function delete($id) {
        $id = intval($id);
        return mysqli_query($this->conn, "DELETE FROM users WHERE id = $id");
    }

    public function getByUsername($username) {
        $username = mysqli_real_escape_string($this->conn, $username);
        $result = mysqli_query($this->conn, "SELECT * FROM users WHERE username = '$username'");
        return mysqli_fetch_assoc($result);
    }
}
?>
