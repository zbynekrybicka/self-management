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
        'body_kvota_id' => FILTER_VALIDATE_INT,
        'body' => FILTER_VALIDATE_INT,
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    if (!maPravoPridavatBody($db, $values['body_kvota_id'], $userId)) {
        http_response_code(401);
        exit;
    }

    $values += [
        'udeleno' => time(),
        'uzivatel_id' => $userId
    ];
    
    $db->insert('body', $values)->execute();
    $values['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($values);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE
    if (!maPravoOdebiratBody($db, $data->id, $userId)) {
        http_response_code(401);
        exit;
    }
    $db->delete('body')->where('id = %u', $data->id)->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}