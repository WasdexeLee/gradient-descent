<?php 

// Enum to address different food details
enum Food: int {
    case NAME = 0;
    case CATEGORY_ID = 1;
    case DESCRIPTION = 2;
    case PRICE = 3;
    case AVAILABILITY = 4;
    case IMAGE = 5;
    case PREP_TIME = 6;
    case NUM_SOLD = 7;
}


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
    if ($_POST['func'] === 'getFoodDetail')
        getFoodDetail($connection);
    else if ($_POST['func'] === 'insertUser')
        insertUser($connection);
}



function getFoodDetail(&$connection){
    // Create query, prepare and bind parameters
    $query_template = "SELECT food_name, food_category_id, food_description, food_price, food_availability, food_image, food_prep_time, food_num_sold FROM Food";
    $prepared_query = $connection->prepare($query_template);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]);


    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]];
        // $pass[] = [$result[0], $result[1], $result[2], $result[3], $result[4], $result[5], $result[6], $result[7]];


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