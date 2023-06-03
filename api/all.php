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
    $specifickeUkoly = $db->select('*')->from('specificke_ukoly')->fetchall();
    $poznamky = $db->select('*')->from('poznamky')->fetchAll();

    echo json_encode([ 
        'ukoly' => $ukoly,
        'stavy' => $stavy,
        'casy' => $casy,
        'prioritni_fronta' => $prioritniFronta,
        'specificke_ukoly' => $specifickeUkoly,
        'poznamky' => $poznamky
    ]);
}