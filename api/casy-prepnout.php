<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    if (!maPravoPracovatNaUkolu($db, $data->id, $userId)) {
        http_response_code(401);
        exit;
    }

    $konec = time();
    $db->update('casy', [ 'konec' => $konec ])->where('uzivatel_id = %u AND konec IS NULL', $userId)->execute();

    $values = [
        'uzivatel_id' => $userId,
        'ukol_id' => $data->id,
        'zacatek' => time(),
        'konec' => null,
    ];

    $db->insert('casy', $values)->execute();
    $values['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode([ "novyZacatek" => $values, "konec" => $konec]);
} else {
    // INVALID METHOD
    http_response_code(405);
}