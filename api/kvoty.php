<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $values = filter_var_array((array) $data, [
        'ukol_id' => FILTER_VALIDATE_INT,
        'datum' => [ 
            'filter' => FILTER_VALIDATE_REGEXP,
            'options' => [ 'match' => '/[0-9]{4}-[0-9]{2}-[0-9]{2}/']
        ],
        'cas' => FILTER_VALIDATE_INT
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    if (!maPravoPracovatNaUkolu($db, $values['ukol_id'], $userId)) {
        http_response_code(401);
        exit;
    }

    $values['uzivatel_id'] = $userId;

    $db->insert('kvoty', $values)->execute();
    $values['id'] = $db->getInsertId();

    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($values);
    
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {

    $db->delete('kvoty')->where('id = %u AND user_id = %u', $_GET['id'], $userId)->execute();
    if ($db->getAffectedRows()) {
        http_response_code(204);
    } else {
        http_response_code(401);
    }
} else {
    // INVALID METHOD
    http_response_code(405);
}