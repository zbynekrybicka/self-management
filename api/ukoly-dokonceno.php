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
 
    $db->update('ukoly', [ 'dokonceno' => time() ])->where('id = %u', $data->id)->execute();
    $cas = $db->select('*')->from('casy')->where('konec IS NULL AND ukol_id = %u AND uzivatel_id = %u', $data->id, $userId)->fetch();
    if (!$cas) {
        http_response_code(204);
        exit;
    } 
    $time = time();
    $db->update('casy', ['konec' => $time ])->where('id = %u', $cas->id)->execute();
    $ukol_id = $db->select('ukol_id')->from('ukoly')->where('id = %u', $cas->ukol_id)->fetchSingle();

    if (!$ukol_id) {
        $ukol_id = $db->select('ukol_id')->from('specificke_ukoly')->where('typ = %s', 'pause')->fetchSingle();
    }

    if (!$ukol_id) {
        http_response_code(204);
        exit;
    }

    $values = [
        'uzivatel_id' => $userId,
        'ukol_id' => $ukol_id,
        'zacatek' => $time,
        'konec' => null,
    ];

    $db->insert('casy', $values)->execute();
    $values['id'] = $db->getInsertId();
    http_response_code(201);
    echo json_encode([ "novyZacatek" => $values, "konec" => $time]);
} else {
    // INVALID METHOD
    http_response_code(405);
}