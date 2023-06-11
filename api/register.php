<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

$email = $data->email;
$password = $data->password;
$token = $data->token;

$recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";


// Data pro POST požadavek
$data = array(
    'secret' => "6LfUmIomAAAAAPCJf-vyqdXIvmjItiJDhcTOXqAD",
    'response' => $token
);

// Inicializace cURL
$ch = curl_init($recaptchaUrl);

// Nastavení cURL možností
curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
curl_setopt($ch, CURLOPT_POST, true);
curl_setopt($ch, CURLOPT_POSTFIELDS, $data);

// Spuštění cURL a získání odpovědi
$response = curl_exec($ch);

// Ukončení cURL session
curl_close($ch);

// Dekódování odpovědi
// $responseData = json_decode($response);

http_response_code(200);
echo $response;