<?php
// backend/routes/upload_image.php
include_once __DIR__ . '/../config/db.php';

$database = new Database();
$db = $database->getConnection();

function checkAuthToken($db) {
    $headers = apache_request_headers();
    $authHeader = isset($headers['Authorization']) ? $headers['Authorization'] : '';
    // Handle case-insensitive header keys
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

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // Upload Image to Project
    if (!checkAuthToken($db)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    if (isset($_FILES['image']) && isset($id)) { // $id is project_id passed from index.php
        $target_dir = "uploads/";
        if (!file_exists(__DIR__ . '/../' . $target_dir)) {
            mkdir(__DIR__ . '/../' . $target_dir, 0777, true);
        }

        $file_name = time() . '_' . basename($_FILES["image"]["name"]);
        $target_file = $target_dir . $file_name;
        $imageFileType = strtolower(pathinfo($target_file, PATHINFO_EXTENSION));

        $allowed_types = ['jpg', 'jpeg', 'png', 'gif'];
        if (!in_array($imageFileType, $allowed_types)) {
            http_response_code(400);
            echo json_encode(["message" => "Invalid file type."]);
            exit;
        }

        if (move_uploaded_file($_FILES["image"]["tmp_name"], __DIR__ . '/../' . $target_file)) {
            $query = "INSERT INTO project_images (project_id, image_path) VALUES (:project_id, :image_path)";
            $stmt = $db->prepare($query);
            $stmt->bindParam(":project_id", $id);
            $stmt->bindParam(":image_path", $target_file);

            if ($stmt->execute()) {
                http_response_code(201);
                echo json_encode(["message" => "Image uploaded.", "path" => $target_file]);
            } else {
                http_response_code(500);
                echo json_encode(["message" => "Database error."]);
            }
        } else {
            http_response_code(500);
            echo json_encode(["message" => "File upload failed."]);
        }
    } else {
        http_response_code(400);
        echo json_encode(["message" => "No file or Project ID provided."]);
    }

} elseif ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // Delete Image
    // Here $id is image_id passed from index.php when resource is project-images
    if (!checkAuthToken($db)) {
        http_response_code(401);
        echo json_encode(["message" => "Unauthorized"]);
        exit;
    }

    $query = "SELECT image_path FROM project_images WHERE id = :id";
    $stmt = $db->prepare($query);
    $stmt->bindParam(":id", $id);
    $stmt->execute();
    $row = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($row) {
        if (file_exists(__DIR__ . '/../' . $row['image_path'])) {
            unlink(__DIR__ . '/../' . $row['image_path']);
        }

        $delQuery = "DELETE FROM project_images WHERE id = :id";
        $delStmt = $db->prepare($delQuery);
        $delStmt->bindParam(":id", $id);
        if ($delStmt->execute()) {
            echo json_encode(["message" => "Image deleted."]);
        } else {
            http_response_code(500);
            echo json_encode(["message" => "Failed to delete from DB."]);
        }
    } else {
        http_response_code(404);
        echo json_encode(["message" => "Image not found."]);
    }
}
