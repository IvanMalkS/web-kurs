<?php

$host = 'db';
$db   = 'lab3';
$user = 'labuser';
$pass = 'labpass';
$charset = 'utf8mb4';

$dsn = "mysql:host=$host;dbname=$db;charset=$charset";
$options = [
    PDO::ATTR_ERRMODE            => PDO::ERRMODE_EXCEPTION,
    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
    PDO::ATTR_EMULATE_PREPARES   => false,
    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4 COLLATE utf8mb4_unicode_ci"
];

$max_attempts = 10;
$attempt = 0;

while ($attempt < $max_attempts) {
    try {
        $pdo = new PDO($dsn, $user, $pass, $options);
        break;
    } catch (\PDOException $e) {
        $attempt++;
        if ($attempt >= $max_attempts) {
            throw new \PDOException($e->getMessage(), (int)$e->getCode());
        }
        sleep(2);
    }
}