<?php

function maPravoEditovatUkol($db, $ukol_id, $user_id) {
    $pocet = $db->select('count(*)')->from('ukoly')->where('id = %u AND uzivatel_id = %u', $ukol_id, $user_id)->fetchSingle();
    return intval($pocet) === 1;
}

function maPravoPridavatBody($db, $body_kvota_id, $user_id) {
    $ukol_id = $db->select('ukol_id')->from('body_kvoty')->where('id = %u', $body_kvota_id)->fetchSingle();
    if (!$ukol_id) {
        return false;
    }
    return maPravoEditovatUkol($db, $ukol_id, $user_id);
}

function maPravoOdebiratBody($db, $body_id, $user_id) {
    $body_kvota_id = $db->select('body_kvota_id')->from('body')->where('id = %u', $body_id)->fetchSingle();
    if (!$body_kvota_id) {
        return false;
    }
    return maPravoPridavatBody($db, $body_kvota_id, $user_id);
}

function maPravoPracovatNaUkolu($db, $ukol_id, $user_id) {
    return maPravoEditovatUkol($db, $ukol_id, $user_id);
}

function maPravoDokoncitUkol($db, $ukol_id, $user_id) {
    return maPravoEditovatUkol($db, $ukol_id, $user_id);
}