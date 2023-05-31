<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();
if (!$userId) {
    http_response_code(401);
} else {
    $ukoly = $db->select('*')->from('ukoly')->fetchAll();
    $stavy = $db->select('id, nazev')->from('stavy')->fetchPairs('id', 'nazev');
    $casy = $db->select('*')->from('casy')->fetchAll();
    $prioritniFronta = $db->select('*')->from('prioritni_fronta')->fetchAll();

    echo json_encode([ 
        'ukoly' => $ukoly,
        'stavy' => $stavy,
        'casy' => $casy,
        'prioritni_fronta' => $prioritniFronta
    ]);
}