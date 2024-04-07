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


if (isset($_POST['func'])){
    if ($_POST['func'] === 'getUserName')
        getUserName($connection);
    else if ($_POST['func'] === 'insertUser')
        insertUser($connection);
}


function getUserName(&$connection){
    // Create query, prepare and bind parameters
    $query_template = "SELECT user_name FROM User";
    $prepared_query = $connection->prepare($query_template);

    // Init array to store response
    $result = "";
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result);


    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = $result;


    // Encode into json formate and echo back to Javascript 
    echo json_encode($pass);

    // Close query
    $prepared_query->close();
}


function insertUser(&$connection){
     // Create query, prepare and bind parameters
    $query_template = "INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?, ?)";
    $prepared_query = $connection->prepare($query_template);
    $temp = 'a';
    $tempe = 'aal';
    $def = "DEFAULT";
    $fal = "false";

    // Bind parameter to query 
    $prepared_query->bind_param("ssssss", $_POST['user_name'], $_POST['user_password'], $temp,$tempe, $fal, $def);
    // $prepared_query->bind_param("ssssss", $_POST['user_name'], $_POST['user_password'], 'a', 'a',false, DEFAULT);
    $prepared_query->execute();

    echo "Insert Success";

    // Close query
    $prepared_query->close();
}


// Close connection
$connection->close();

?>