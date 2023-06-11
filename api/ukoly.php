<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    // CREATE
    $values = filter_var_array((array) $data, [
        'nazev' => FILTER_DEFAULT,
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    $ukolId = $data->ukol_id ?? null;
    if ($ukolId && !maPravoEditovatUkol($db, $ukolId, $userId)) {
        http_response_code(401);
        exit;
    }

    $values += [
        'uzivatel_id' => $userId,
        'popis' => '',
        'dokonceno' => null,
        'ukol_id' => $ukolId,
    ];

    $db->insert('ukoly', $values)->execute();
    $values['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($values);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    $values = filter_var_array((array) $data, [
        'id' => FILTER_VALIDATE_INT,
        'nazev' => FILTER_DEFAULT,
        'popis' => FILTER_DEFAULT,
    ]);

    if (!maPravoEditovatUkol($db, $values['id'], $userId)) {
        http_response_code(401);
        exit;
    }

    $db->update('ukoly', $values)->where('id = %u', $values['id'])->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}