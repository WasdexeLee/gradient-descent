<?php

require_once 'session_config.php';


// Start session
session_start();
// Set the correct header for JSON output
header('Content-Type: application/json');


// Check if the user is logged in
// Stop script execution if the user is not logged in
if (!isset($_SESSION["user_id"])) {
    echo json_encode(["loggedIn" => false]);
    exit;
}


// Send message that user is logged in
echo json_encode(["loggedIn" => true]);

?>