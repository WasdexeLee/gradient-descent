<?php

require_once 'session_config.php';
require_once 'database_config.php';


// Get username and password from post
$user_name = $_POST['user_name'];
$user_password = $_POST['user_password'];
// Number of rows returned
$num_rowz = 0;

// Create query, prepare and bind parameters
$query_template = "SELECT user_operator, user_id FROM User WHERE (user_name = ?) AND (user_password = ?)";
$prepared_query = $connection->prepare($query_template);

// Init arrays to store response
$result = [];

// Bind parameters, execute query and bind results to array
$prepared_query->bind_param("ss", $user_name, $user_password);
$prepared_query->execute();
$prepared_query->bind_result($result[0], $result[1]);


// Get all rows and count
while ($prepared_query->fetch())
    $num_rowz++;

// If number of rows > 0
// username password match
if ($num_rowz > 0) {
    // Starts a session for this particular user
    session_start();

    // Set session variable
    // Essentially, only user_id is needed as user_id would be sufficient to fetch all other data
    $_SESSION["user_id"] = $result[1];
}
// Else validity false and associated values
else {
    $result[0] = -1;
    $result[1] = -1;
}


// Notify client response type is json 
header('Content-Type: application/json');
// Encode into json format and echo back to Javascript 
echo json_encode($result);

// Close query and connection
$prepared_query->close();
$connection->close();

?>