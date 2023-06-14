<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$userId = checkAuth();
if (!$userId) {
    http_response_code(401);
} else {
    $system = $db->select('polozka, hodnota')->from('system')->where('uzivatel_id = %u', $userId)->fetchPairs('polozka', 'hodnota');
    $ukoly = $db->select('*')->from('ukoly')->where('uzivatel_id = %u', $userId)->fetchAll();

    $ukolyIds = array_map(function ($ukol) {
        return $ukol->id;
    }, $ukoly);

    $casy = $db->select('*')->from('casy')->where("uzivatel_id = %u", $userId)->fetchAll();
    $specifickeUkoly = $db->select('*')->from('specificke_ukoly')->where("uzivatel_id = %u", $userId)->fetchall();
    $poznamky = $db->select('*')->from('poznamky')->where("ukol_id IN %in", $ukolyIds)->fetchAll();
    $kvoty = $db->select('*')->from('kvoty')->where("uzivatel_id = %u", $userId)->fetchAll();

    $bodyKvoty = $db->select('*')->from('body_kvoty')->where("ukol_id IN %in", $ukolyIds)->fetchAll();
    $bodyKvotyIds = array_map(function ($kvota) {
        return $kvota->id;
    }, $bodyKvoty);
    $body = $db->select('*')->from('body')->where('body_kvota_id IN %in', $bodyKvotyIds)->fetchAll();

    $partneriRows = $db->select('*')->from('partneri')->where('uzivatel1_id = %u OR uzivatel2_id = %u', $userId, $userId)->fetchAll();
    $partneriIds = [$userId];
    foreach ($partneriRows as $row) {
        if ($row->uzivatel1_id === $userId) {
            $partneriIds[] = $row->uzivatel2_id;
        } else {
            $partneriIds[] = $row->uzivatel1_id;
        }
    }
    $partneri = $db->select('id, jmeno')->from('uzivatele')->where('id IN %in', $partneriIds)->fetchPairs('id', 'jmeno');

    echo json_encode([
        'uzivatel_id' => $userId,
        'system' => $system,
        'ukoly' => $ukoly,
        'stavy' => $stavy,
        'casy' => $casy,
        'specificke_ukoly' => $specifickeUkoly,
        'poznamky' => $poznamky,
        'kvoty' => $kvoty,
        'body_kvoty' => $bodyKvoty,
        'body' => $body,
        'partneri' => $partneri,
    ]);
}