<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once '_ukoly/zmenitStav.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    if (!maPravoDokoncitUkol($db, $data->id, $userId)) {
        http_response_code(401);
        exit;
    }

    $db->update('ukoly', [ 'dokonceno' => null ])->where('id = %u', $data->id)->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}