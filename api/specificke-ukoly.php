<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once '_ukoly/zmenitStav.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $db->insert('specificke_ukoly', [
        'ukol_id' => $data->ukol_id,
        'typ' => $data->typ,
    ])->execute();
    http_response_code(204);

} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    list($ukol_id, $typ) = explode("-", $_GET['id']);

    $db->delete('specificke_ukoly')->where([
        'ukol_id' => $ukol_id,
        'typ' => $typ,
    ])->execute();
    http_response_code(204);

} else {
    // INVALID METHOD
    http_response_code(405);
}