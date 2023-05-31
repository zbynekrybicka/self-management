<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    $data = [
        'nazev' => $data->nazev,
        'popis' => '',
        'stav_id' => 1,
        'ukol_id' => $data->ukol_id ?? null
    ]; 

    $db->insert('ukoly', $data)->execute();
    $data['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    $db->update('ukoly', (array) $data)->where('id = %u', $data->id)->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}