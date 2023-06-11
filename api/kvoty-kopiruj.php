<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $kvoty = $db->select('*')->from('kvoty')->where('datum = %s AND uzivatel_id = %u', $data->zeDne, $userId)->fetchAll();
    $result = [];
    foreach ($kvoty as $kvota) {
        unset($kvota->id);
        $kvota->datum = $data->naDen;
        $db->insert('kvoty', (array) $kvota)->execute();
        $kvota->id = $db->getInsertId();
        $result[] = (array) $kvota;
    }

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($result);
    
} else {
    // INVALID METHOD
    http_response_code(405);
}