<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $casy = $db->select('*')->from('casy')->where('id = %u OR id = %u', $data->id, $data->id - 1)->orderBy('id')->fetchAll();
    list($predchozi, $aktualni) = $casy;
    $predchozi->konec -= $data->minuty * 60;
    $aktualni->zacatek -= $data->minuty * 60;

    $db->update('casy', $predchozi)->where('id = %u', $predchozi->id)->execute();
    $db->update('casy', $aktualni)->where('id = %u', $aktualni->id)->execute();

    http_response_code(200);
    echo json_encode([
        'predchozi' => $predchozi,
        'aktualni' => $aktualni,
    ]);
} else {
    // INVALID METHOD
    http_response_code(405);
}