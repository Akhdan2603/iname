<?php
// backend/routes/clients.php
include_once __DIR__ . '/../config/db.php';

$database = new Database();
$db = $database->getConnection();

if ($_SERVER['REQUEST_METHOD'] === 'GET') {
    $query = "SELECT id, name FROM clients ORDER BY name ASC";
    $stmt = $db->prepare($query);
    $stmt->execute();

    $clients = $stmt->fetchAll(PDO::FETCH_ASSOC);

    http_response_code(200);
    echo json_encode($clients);
} else {
    http_response_code(405);
    echo json_encode(["message" => "Method not allowed."]);
}
