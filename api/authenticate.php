<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'GoogleAuthenticator/PHPGangsta/GoogleAuthenticator.php';

use Firebase\JWT\JWT;

$user_id = $data->id;
$code = $data->code;
$secret = $data->secret ?? false;

$row = $db->select('google_authenticator_id')->from('uzivatele')->where('id = %u', $user_id)->fetch();
if ($row) {
  $ga = new \PHPGangsta_GoogleAuthenticator();
  if (!$row->google_authenticator_id) {
    $db->update('uzivatele', ['google_authenticator_id' => $secret ])->where('id = %u', $user_id)->execute();
  } else {
    $secret = $row->google_authenticator_id;
  } 
  
  $valid = $ga->verifyCode($secret, $code);

  if ($valid) {
    // Kód je platný, autentizace byla úspěšná
    $payload = array('user_id' => $user_id);
    $token = JWT::encode($payload, JWT_KEY, 'HS256');
    echo json_encode($token);
  } else {
    // Kód není platný
    http_response_code(400);
    echo json_encode(array('error' => 'Autorizační kód není platný.'));
  }
} else {
  // Osoba nebyla nalezena
  http_response_code(400);
  echo json_encode(array('error' => 'Osoba s tímto ID nebyla nalezena.'));
}
