<?php

// Credentials
$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";


// Create new connection to MySQL database
$connection = new mysqli($host, $username, $password, $dbname);

// Check for connection error. If true, throw error
if ($connection->connect_error) {
    die("Connnection ERROR !!!  " . $connection->connect_error);
}

?>