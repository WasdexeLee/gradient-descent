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
    $query_template = "INSERT INTO User VALUES (NULL, ?, ?, ?, ?, ?, ?, ?)";
    $prepared_query = $connection->prepare($query_template);

    // Convert back to boolean 
    $user_notification = $_POST['user_notification'] === "TRUE" ? 1 : 0;
    $user_operator = $_POST['user_operator'] === "TRUE" ? 1 : 0;
    

    // Bind parameter to query 
    $prepared_query->bind_param("sssssii", $_POST['user_name'], $_POST['user_password'], $_POST['user_email'], $_POST['user_address'], $_POST['user_phone'], $user_notification, $user_operator);
    $prepared_query->execute();

    echo "Insert Success";

    // Close query
    $prepared_query->close();
}


// Close connection
$connection->close();

?>