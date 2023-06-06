<?php
$soubor = file_get_contents(__DIR__ . '/dist/index.html');

$soubor = preg_replace("/(\")\/(css|js)/", "$1$2", $soubor);
$soubor = preg_replace("/(window\.API_URL = \")([^\"]*)(\")/", "$1api$3", $soubor);

file_put_contents(__DIR__ . '/dist/index.html', $soubor);