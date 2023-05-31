<?php

function zmenitStav($db, $id, $stav) {
    $db->update('ukoly', [ 'stav_id' => $stav])->where('id = %u', $id)->execute();
    $ids = $db->select('id')->from('ukoly')->where('ukol_id = %u', $id)->fetchPairs(null, 'id');
    foreach ($ids as $uid) {
        zmenitStav($db, $uid, $stav);
    }
}

