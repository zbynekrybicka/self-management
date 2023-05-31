<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    $data = [
        'ukol_id' => $data->ukol_id,
        'zacatek' => time(),
        'konec' => null,
    ]; 

    $db->insert('casy', $data)->execute();
    $data['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    $data = [ 'konec' => time() ];
    $db->update('casy', $data)->where('konec IS NULL')->execute();
    http_response_code(200);
    echo json_encode($data);
} else {
    // INVALID METHOD
    http_response_code(405);
}