<?php return array(
    'root' => array(
        'pretty_version' => '1.0.0+no-version-set',
        'version' => '1.0.0.0',
        'type' => 'library',
        'install_path' => __DIR__ . '/../../',
        'aliases' => array(),
        'reference' => NULL,
        'name' => '__root__',
        'dev' => true,
    ),
    'versions' => array(
        '__root__' => array(
            'pretty_version' => '1.0.0+no-version-set',
            'version' => '1.0.0.0',
            'type' => 'library',
            'install_path' => __DIR__ . '/../../',
            'aliases' => array(),
            'reference' => NULL,
            'dev_requirement' => false,
        ),
        'dg/dibi' => array(
            'dev_requirement' => false,
            'replaced' => array(
                0 => '*',
            ),
        ),
        'dibi/dibi' => array(
            'pretty_version' => 'v4.2.7',
            'version' => '4.2.7.0',
            'type' => 'library',
            'install_path' => __DIR__ . '/../dibi/dibi',
            'aliases' => array(),
            'reference' => '7fa05f381b23fdc59af98caeb03b1ae8ed1e03ed',
            'dev_requirement' => false,
        ),
        'firebase/php-jwt' => array(
            'pretty_version' => 'v6.4.0',
            'version' => '6.4.0.0',
            'type' => 'library',
            'install_path' => __DIR__ . '/../firebase/php-jwt',
            'aliases' => array(),
            'reference' => '4dd1e007f22a927ac77da5a3fbb067b42d3bc224',
            'dev_requirement' => false,
        ),
    ),
);
