<?php
// backend/routes/projects.php
include_once __DIR__ . '/../config/db.php';

$database = new Database();
$db = $database->getConnection();

$method = $_SERVER['REQUEST_METHOD'];

// Helper to check auth
function checkAuth($db) {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    // Handle case-insensitive header keys just in case
    if (!$authHeader) {
        foreach ($headers as $key => $value) {
            if (strtolower($key) === 'authorization') {
                $authHeader = $value;
                break;
            }
        }
    }

    if (preg_match('/Bearer\s(\S+)/', $authHeader, $matches)) {
        $token = $matches[1];
        $query = "SELECT id FROM admin WHERE token = :token";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":token", $token);
        $stmt->execute();
        if ($stmt->rowCount() > 0) {
            return true;
        }
    }
    return false;
}

if ($method === 'GET') {
    if (isset($id) && $id) {
        // Get One
        $query = "SELECT p.*, c.name as client_name
                  FROM projects p
                  LEFT JOIN clients c ON p.client_id = c.id
                  WHERE p.id = :id";
        $stmt = $db->prepare($query);
        $stmt->bindParam(":id", $id);
        $stmt->execute();
        $project = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($project) {
            // Fetch images
            $imgQuery = "SELECT id, image_path FROM project_images WHERE project_id = :id";
            $imgStmt = $db->prepare($imgQuery);
            $imgStmt->bindParam(":id", $id);
            $imgStmt->execute();
            $project['images'] = $imgStmt->fetchAll(PDO::FETCH_ASSOC);

            echo json_encode($project);
        } else {
            http_response_code(404);
            echo json_encode(["message" => "Project not found."]);
        }
    } else {
        // Get All with Thumbnail (Avoid N+1)
        // We use a subquery to get the first image for each project
        $query = "SELECT p.*, c.name as client_name,
                  (SELECT image_path FROM project_images WHERE project_id = p.id LIMIT 1) as thumbnail
                  FROM projects p
                  LEFT JOIN clients c ON p.client_id = c.id
                  ORDER BY p.date DESC";
        $stmt = $db->prepare($query);
        $stmt->execute();
        $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

        echo json_encode($projects);
    }
} elseif ($method === 'POST') {
    if (!checkAuth($db)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"));

    if (!empty($data->title) && !empty($data->description) && !empty($data->client_id) && !empty($data->date)) {
        $query = "INSERT INTO projects (title, description, date, client_id) VALUES (:title, :description, :date, :client_id)";
        $stmt = $db->prepare($query);

        $stmt->bindParam(":title", $data->title);
        $stmt->bindParam(":description", $data->description);
        $stmt->bindParam(":date", $data->date);
        $stmt->bindParam(":client_id", $data->client_id);

        if ($stmt->execute()) {
            http_response_code(201);
            echo json_encode(["message" => "Project created.", "id" => $db->lastInsertId()]);
        } else {
            http_response_code(503);
            echo json_encode(["message" => "Unable to create project."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "Incomplete data."]);
    }

} elseif ($method === 'PUT') {
    if (!checkAuth($db)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID required."]);
        exit;
    }

    $data = json_decode(file_get_contents("php://input"));

    $query = "UPDATE projects SET title = :title, description = :description, date = :date, client_id = :client_id WHERE id = :id";
    $stmt = $db->prepare($query);

    $stmt->bindParam(":title", $data->title);
    $stmt->bindParam(":description", $data->description);
    $stmt->bindParam(":date", $data->date);
    $stmt->bindParam(":client_id", $data->client_id);
    $stmt->bindParam(":id", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Project updated."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to update project."]);
    }

} elseif ($method === 'DELETE') {
    if (!checkAuth($db)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    if (!$id) {
        http_response_code(400);
        echo json_encode(["message" => "ID required."]);
        exit;
    }

    // Delete images from disk first
    $imgQuery = "SELECT image_path FROM project_images WHERE project_id = :id";
    $stmt = $db->prepare($imgQuery);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    while ($row = $stmt->fetch(PDO::FETCH_ASSOC)) {
        if (file_exists(__DIR__ . '/../' . $row['image_path'])) {
            unlink(__DIR__ . '/../' . $row['image_path']);
        }
    }

    $query = "DELETE FROM projects WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);

    if ($stmt->execute()) {
        echo json_encode(["message" => "Project deleted."]);
    } else {
        http_response_code(503);
        echo json_encode(["message" => "Unable to delete project."]);
    }
}
