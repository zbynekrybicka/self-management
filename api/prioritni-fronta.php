<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    $data = [
        'ukol_id' => $data->id,
        'priority' => 0
    ]; 

    $db->insert('prioritni_fronta', $data)->execute();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($data);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE

    // $db->update('ukoly', (array) $data)->where('id = %u', $data->id)->execute();
    // http_response_code(204);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    $db->delete('prioritni_fronta')->where('ukol_id = %u', $_GET['id'])->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}