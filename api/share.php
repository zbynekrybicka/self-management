<html>
    <head>
    <meta name="viewport" content="width=device-width,initial-scale=1.0">
    </head>
<body style="text-align:center">
<?php
require_once 'vendor/autoload.php';
require_once 'common.php';

header('Content-type: text/html; charset: utf-8');

$cas = $db->select('*')->from('casy')->orderBy('zacatek DESC')->limit(1)->fetch();
if (!$cas) {
    echo "<h1 style='color:red'>Jejda... něco se pokazilo</h1>";
    die;
}

$ukoly = [];
$ukol = $db->select('nazev, ukol_id')->from('ukoly')->where('id = %u', $cas->ukol_id)->fetch();
while ($ukol) {
    $ukoly[] = $ukol->nazev;
    $ukol = $db->select('nazev, ukol_id')->from('ukoly')->where('id = %u', $ukol->ukol_id)->fetch();
}

$ukol = implode("<br/>", array_reverse($ukoly));

if ($cas->konec) {
    $cas = date("d. m Y H:i", $cas->konec);
    echo "<h1>Zrovna na ničem nedělám</h1>";
    echo "<h2>Naposledy jsem dělal na</h2>";
    echo "<h3>{$ukol} <br/><br/>do<br/><br/> {$cas}</h3>";
} else {
    $ukol = implode("<br/>", array_reverse($ukoly));
    $cas = date("d. m Y H:i", $cas->zacatek);
    echo "<h1>Zrovna dělám</h1>";
    echo "<h2>{$ukol} <br/><br/>od<br/><br/> {$cas}</h2>";
}

?>
</body>
</html>