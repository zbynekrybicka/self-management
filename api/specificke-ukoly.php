<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once '_ukoly/zmenitStav.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $values = filter_var_array((array) $data, [
        'ukol_id' => FILTER_VALIDATE_INT,
        'typ' => FILTER_DEFAULT,
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

    $db->insert('specificke_ukoly', $values)->execute();
    http_response_code(204);

} else if ($_SERVER['REQUEST_METHOD'] === 'DELETE') {
    list($ukol_id, $typ) = explode("-", $_GET['id']);

    $values = filter_var_array([
        'ukol_id' => $ukol_id,
        'typ' => $typ,
    ], [
        'ukol_id' => FILTER_VALIDATE_INT,
        'typ' => FILTER_DEFAULT,
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

    $db->delete('specificke_ukoly')->where($values)->execute();
    http_response_code(204);

} else {
    // INVALID METHOD
    http_response_code(405);
}