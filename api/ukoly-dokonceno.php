<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once '_ukoly/zmenitStav.php';

$userId = checkAuth();

if (!$userId) {
    http_response_code(401);
} else if ($_SERVER['REQUEST_METHOD'] === 'PUT') {
    // UPDATE
    zmenitStav($db, $data->id, 2);
    $cas = $db->select('*')->from('casy')->where('konec IS NULL AND ukol_id = %u', $data->id)->fetch();
    if ($cas) {
        $data = [ 'konec' => time() ];
        $db->update('casy', $data)->where('id = %u', $cas->id)->execute();
        $ukol_id = $db->select('ukol_id')->from('specificke_ukoly')->where('typ = %s', 'pauza')->fetchSingle();

        $cas = [
            'ukol_id' => $ukol_id,
            'zacatek' => time(),
            'konec' => null
        ];
        $db->insert('casy', $cas)->execute();
        $cas['id'] = $db->getInsertId();
        echo json_encode([ 
            'konec' => $data['konec'], 
            'novyZacatek' => $cas 
        ]);
    } else {
        echo json_encode(null);
    }
    http_response_code(200);
} else {
    // INVALID METHOD
    http_response_code(405);
}