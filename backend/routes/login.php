<?php
// backend/routes/login.php
include_once __DIR__ . '/../config/db.php';

$database = new Database();
$db = $database->getConnection();

$data = json_decode(file_get_contents("php://input"));

if (!empty($data->username) && !empty($data->password)) {
    $query = "SELECT id, username, password_hash FROM admin WHERE username = :username LIMIT 1";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":username", $data->username);
    $stmt->execute();

    if ($stmt->rowCount() > 0) {
        $row = $stmt->fetch(PDO::FETCH_ASSOC);
        if (password_verify($data->password, $row['password_hash'])) {
            // Generate a simple token
            $token = bin2hex(random_bytes(32));

            // Store token in DB
            $update_query = "UPDATE admin SET token = :token WHERE id = :id";
            $update_stmt = $db->prepare($update_query);
            $update_stmt->bindParam(":token", $token);
            $update_stmt->bindParam(":id", $row['id']);

            if ($update_stmt->execute()) {
                http_response_code(200);
                echo json_encode([
                    "message" => "Login successful.",
                    "token" => $token,
                    "username" => $row['username']
                ]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Failed to generate token."]);
            }
        } else {
            http_response_code(401);
            echo json_encode(["message" => "Invalid password."]);
        }
    } else {
        http_response_code(401);
        echo json_encode(["message" => "User not found."]);
    }
} else {
    http_response_code(400);
    echo json_encode(["message" => "Incomplete data."]);
}
