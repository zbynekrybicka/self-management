<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $data = [
        'ukol_id' => $data->ukol_id,
        'poznamka' => $data->poznamka,
        'zapsano' => time(),
    ]; 
    $db->insert('poznamky', $data)->execute();
    $data['id'] = $db->getInsertId();

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($data);
    
} else {
    // INVALID METHOD
    http_response_code(405);
}