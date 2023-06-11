<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'validation.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {

    $values = filter_var_array((array) $data, [
        'id' => FILTER_VALIDATE_INT,
        'minuty' => FILTER_VALIDATE_INT,
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }

    $casy = $db->select('*')->from('casy')->where('id <= %u AND uzivatel_id = %u', $values['id'], $userId)->orderBy('id DESC')->limit(2)->fetchAll();
    if (count($casy) !== 2) {
        http_response_code(400);
        echo json_encode('Nebyly nalezeny oba časy, které chcete posunout.');
        exit;   
    }
    list($aktualni, $predchozi) = $casy;
    $predchozi->konec -= $values['minuty'] * 60;
    $aktualni->zacatek -= $values['minuty'] * 60;

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