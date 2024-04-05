<?php 

// Credentials
$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";


// Create new connection to MySQL database
$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error){
    die("Connnection ERROR !!!  " . $connection->connect_error);
}


// Create query, prepare and bind parameters
$query_template = "SELECT user_name FROM User";
$prepared_query = $connection->prepare($query_template);

// Init array to store response
$pass = [];

// Execute query and bind results to array
$prepared_query->execute();
$prepared_query->bind_result($result);


// Fetch all response from server
while ($prepared_query->fetch())
    $pass[] = $result;


// Encode into json formate and echo back to Javascript 
echo json_encode($pass);


// Close query and connection
$prepared_query->close();
$connection->close();

?>