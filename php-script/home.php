<?php

$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";
$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

function getTopFood(&$connection) {
    
    $query_template = "SELECT food_name, food_image, food_num_sold FROM Food ORDER BY food_num_sold DESC LIMIT 3";
    $prepared_query = $connection->prepare($query_template);
    // Init array to store response
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
    // Close query
    $prepared_query->close();

}

getTopFood($connection)

 ?>
