<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    $konec = time();
    $db->update('casy', [ 'konec' => $konec ])->where('konec IS NULL')->execute();

    $data = [
        'ukol_id' => $data->id,
        'zacatek' => time(),
        'konec' => null,
    ]; 

    $db->insert('casy', $data)->execute();
    $data['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode([ "novyZacatek" => $data, "konec" => $konec]);
} else {
    // INVALID METHOD
    http_response_code(405);
}