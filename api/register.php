<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

use Firebase\JWT\JWT;

$token = $data->token;

if ($_SERVER['REQUEST_METHOD'] === 'POST') {

    $values = filter_var_array((array) $data, [
        'email' => FILTER_VALIDATE_EMAIL,
        'password' => FILTER_DEFAULT
    ]);

    if (in_array(false, $values)) {
        http_response_code(400);
        echo json_encode($values);
        exit;
    }


    $pocetMailu = $db->select('count(email)')->from('uzivatele')->where('email = %s', $values['email'])->fetchSingle();
    if ($pocetMailu > 0) {
        http_response_code(400);
        echo json_encode("Tento e-mail již někdo používá.");
        exit;
    }


    if (strlen($values['password']) < 10) {
        http_response_code(400);
        echo json_encode("Heslo musí obsahovat minimálně 10 znaků");
        exit;
    }

    $recaptchaUrl = "https://www.google.com/recaptcha/api/siteverify";
    $data = array(
        'secret' => "6LfUmIomAAAAAPCJf-vyqdXIvmjItiJDhcTOXqAD",
        'response' => $data->token
    );
    $ch = curl_init($recaptchaUrl);
    curl_setopt($ch, CURLOPT_RETURNTRANSFER, true);
    curl_setopt($ch, CURLOPT_POST, true);
    curl_setopt($ch, CURLOPT_POSTFIELDS, $data);
    $response = curl_exec($ch);
    curl_close($ch);

    $responseData = json_decode($response);

    if (!$responseData->success) {
        http_response_code(401);
        exit;
    }

    $values['password'] = password_hash($values['password'], PASSWORD_BCRYPT, ['cost' => 12]);
    $db->insert('uzivatele', $values)->execute();
    $user_id = $db->getInsertId();

    $payload = array('user_id' => $user_id);
    $token = JWT::encode($payload, JWT_KEY, 'HS256');
    http_response_code(201);
    echo json_encode($token);
}