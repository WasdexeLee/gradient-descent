<?php

// Credentials
$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";


// Create new connection to MySQL database
$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error) {
    die("Connnection ERROR !!!  " . $connection->connect_error);
}


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
$prepared_query->bind_result($result[1], $result[2]);


// Get all rows and count
while ($prepared_query->fetch()) 
    $num_rowz++;

// If number of rows > 0
// username password match
if ($num_rowz > 0) {
    // Set validity true
    $result[0] = "true";
}
// Else validity false and associated value
else {
    $result[0] = "false";
    $result[1] = 0;
    $result[2] = 0;
}


// Encode into json formate and echo back to Javascript 
echo json_encode($result);


// Close query and connection
$prepared_query->close();
$connection->close();

?>