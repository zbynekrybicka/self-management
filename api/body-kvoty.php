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
        'ukol_id' => FILTER_VALIDATE_INT,
        'body' => FILTER_VALIDATE_INT,
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    if (!maPravoEditovatUkol($db, $values['ukol_id'], $userId)) {
        http_response_code(401);
        exit;
    }

    $db->insert('body_kvoty', $values)->execute();
    $values['id'] = $db->getInsertId();
    http_response_code(201);
    header('Content-Type: application/json');
    echo json_encode($values);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    $values = filter_var_array((array) $data, [
        'id' => FILTER_VALIDATE_INT,
        'nazev' => FILTER_DEFAULT,
        'ukol_id' => FILTER_VALIDATE_INT,
        'body' => FILTER_VALIDATE_INT,
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    if (!maPravoEditovatUkol($db, $values['ukol_id'], $userId)) {
        http_response_code(401);
        echo json_encode("Pokus o neoprávněnou editaci cizího úkolu! Dej pozor, abych tě nezablokoval!");
        exit;
    }

   $db->update('body_kvoty', $values)->where('id = %u', $values['id'])->execute();
    http_response_code(204);
} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    // DELETE
    $ukol_id = $db->select('ukol_id')->from('body_kvoty')->where('id = %u', $_GET['id'])->fetchSingle();
    if (!maPravoEditovatUkol($db, $ukol_id, $userId)) {
        http_response_code(401);
        exit;
    }

    $db->delete('body_kvoty')->where('id = %u', $_GET['id'])->execute();
    http_response_code(204);
} else {
    // INVALID METHOD
    http_response_code(405);
}