<?php
// backend/index.php

// Handle CORS
header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json; charset=UTF-8");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Max-Age: 3600");
header("Access-Control-Allow-Headers: Content-Type, Access-Control-Allow-Headers, Authorization, X-Requested-With");

if ($_SERVER['REQUEST_METHOD'] === 'OPTIONS') {
    http_response_code(200);
    exit;
}

// Simple Router
$uri = parse_url($_SERVER['REQUEST_URI'], PHP_URL_PATH);
$uri = explode('/', $uri);

// Assumes uri structure is /backend/something or /something depending on server config.
// We will look for the last meaningful segments.
// Adjust this offset based on your actual URL structure.
// If running locally as localhost:8000/, then $uri[1] is the resource.

// Helper to get resource from URI regardless of folder depth
$resource = null;
$id = null;
$sub_resource = null;

// Clean empty elements
$uri = array_values(array_filter($uri));

// Logic to find resource.
// Example: ['projects'] or ['projects', '1'] or ['projects', '1', 'upload-image']
// or ['backend', 'projects'] ...

// We'll iterate to find a known resource
$known_resources = ['admin', 'projects', 'clients', 'project-images'];
$resourceIndex = -1;

foreach ($uri as $index => $segment) {
    if (in_array($segment, $known_resources)) {
        $resource = $segment;
        $resourceIndex = $index;
        break;
    }
}

if ($resource) {
    if (isset($uri[$resourceIndex + 1])) {
        $id = $uri[$resourceIndex + 1];
    }
    if (isset($uri[$resourceIndex + 2])) {
        $sub_resource = $uri[$resourceIndex + 2];
    }
}

// Route Dispatcher
if ($resource === 'admin' && $id === 'login' && $_SERVER['REQUEST_METHOD'] === 'POST') {
    require_once 'routes/login.php';
} elseif ($resource === 'clients' && $_SERVER['REQUEST_METHOD'] === 'GET') {
    require_once 'routes/clients.php';
} elseif ($resource === 'projects') {
    if ($id && $sub_resource === 'upload-image' && $_SERVER['REQUEST_METHOD'] === 'POST') {
        require_once 'routes/upload_image.php';
    } elseif ($id) {
        // Detail, Update, Delete
        require_once 'routes/projects.php';
    } else {
        // List, Create
        require_once 'routes/projects.php';
    }
} elseif ($resource === 'project-images' && $id && $_SERVER['REQUEST_METHOD'] === 'DELETE') {
    require_once 'routes/upload_image.php';
} else {
    http_response_code(404);
    echo json_encode(["message" => "Endpoint not found."]);
}
