<?php
require_once('vendor/autoload.php'); // načtení knihovny pro JWT
use Firebase\JWT\JWT;
use Firebase\JWT\Key;
use Dibi\Connection;

ini_set('display_errors', 'off');

define("JWT_KEY", 'Wl4cwH60#nOSJuG#WNdB1V8xwQCri8jBH*!%ZcMbGggR3ko!$j');

function handleError() {
  
  $error = error_get_last();
  if ($error !== null && $error['type'] === E_ERROR) {
    header('Content-Type: application/json');
    http_response_code(500);
    echo json_encode($error);
  }
}

function checkAuth() {
  $jwt = $_SERVER['HTTP_AUTHORIZATION'] ?? false;
  if (!$jwt) {
    return false;
  }

  $jwt = str_replace('Bearer ', '', $jwt);
  try {
    $user = JWT::decode($jwt, new Key(JWT_KEY, 'HS256'));
  } catch (\Exception $e) {
    throw $e;
    return false;
  }

  return $user->user_id;
}

$db = new Connection([
  'driver' => 'sqlite3',
  'database' => './self-management.db',
]);

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
  $data = json_decode(file_get_contents("php://input"));
} else {
  $data = null;
}

if ($_SERVER['REQUEST_METHOD'] === 'POST' || $_SERVER['REQUEST_METHOD'] === 'PUT') {
  $db->update('system', ['hodnota' => time()])->where('polozka = %s', 'posledni_update')->execute();
}

register_shutdown_function('handleError');
// Nastavení CORS hlaviček
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Methods: GET, POST, PUT, DELETE, OPTIONS");
header("Access-Control-Allow-Headers: Content-Type, Authorization");
header('Content-Type: application/json');

// Pokud je request metoda OPTIONS, vrátí povolené metody
if ($_SERVER['REQUEST_METHOD'] == 'OPTIONS') {
  http_response_code(200);
  exit();
}