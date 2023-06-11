<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'GET') {

    $hodnota = $db->select('hodnota')->from('system')->where('polozka = %s AND uzivatel_id = %u', $_GET['id'], $userId)->fetchSingle();
    http_response_code(200);
    header('Content-Type: application/json');
    echo json_encode($hodnota);

} else {
    // INVALID METHOD
    http_response_code(405);
}