<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once '_ukoly/zmenitStav.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    zmenitStav($db, $data->id, 3);
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}