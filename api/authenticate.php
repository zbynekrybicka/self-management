<?php
require_once 'vendor/autoload.php';
require_once 'common.php';
require_once 'GoogleAuthenticator/PHPGangsta/GoogleAuthenticator.php';

use Firebase\JWT\JWT;

$code = $data->code;
$secret = "ADFRRHY4MIKXLOSY";
$authId = "ZJ5769SLIynhZAb4L96wqZtDWy08BuJXgxKLdsfahvp5LsvIgd";

$ga = new \PHPGangsta_GoogleAuthenticator();
if (!$secret) {  
  $secret = $ga->createSecret();
  echo json_encode([
    "url" => $ga->getQRCodeGoogleUrl('Self-management', $secret),
    "secret" => $secret
  ]);
  http_response_code(401);
} else {
  $valid = $ga->verifyCode($secret, $code);

  if ($valid) {
    // Kód je platný, autentizace byla úspěšná
    $payload = array(['authId' => $authId]);
    $token = JWT::encode($payload, JWT_KEY, 'HS256');
    echo json_encode($token);
  } else {
    // Kód není platný
    http_response_code(400);
    echo json_encode(array('error' => 'Autorizační kód není platný.'));
}
}