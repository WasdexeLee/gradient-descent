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
$query_template = "SELECT user_name, user_password, user_operator FROM User";
$prepared_query = $connection->prepare($query_template);

// Init arrays to store response
$result = [];
$pass = [];

// Execute query and bind results to array
$prepared_query->execute();
$prepared_query->bind_result($result[0], $result[1], $result[2]);


// Fetch all response from server
while ($prepared_query->fetch())
    $pass[] = [$result[0], $result[1], $result[2]];


// Encode into json formate and echo back to Javascript 
echo json_encode($pass);


// Close query and connection
$prepared_query->close();
$connection->close();

?>