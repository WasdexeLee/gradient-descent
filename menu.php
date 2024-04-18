<?php 

// Enum to address different food details
enum Food: int {
    case ID = 0;
    case NAME = 1;
    case CATEGORY_ID = 2;
    case DESCRIPTION = 3;
    case PRICE = 4;
    case AVAILABILITY = 5;
    case IMAGE = 6;
    case PREP_TIME = 7;
    case NUM_SOLD = 8;
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
    else if ($_POST['func'] === 'getCart')
        getCart($connection);
    else if ($_POST['func'] === 'modifyCart')
        modifyCart($connection);
}



function getFoodDetail(&$connection){
    // Create query, prepare and bind parameters
    $query_template = "SELECT food_id, food_name, food_category_id, food_description, food_price, food_availability, food_image, food_prep_time, food_num_sold FROM Food";
    $prepared_query = $connection->prepare($query_template);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[Food::ID->value], $result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]);


    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[Food::ID->value], $result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]];


    // Encode into json formate and echo back to Javascript 
    echo json_encode($pass);

    // Close query
    $prepared_query->close();
}


function getCart(&$connection){
    // Create query, prepare and bind parameters
    $query_template = "SELECT food_id, food_num FROM Cart WHERE (Cart.user_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    $user_id = intval($_POST['user_id']);
    
    $prepared_query->bind_param("i", $user_id);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[0], $result[1]);

    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[0], $result[1]];

    echo json_encode($pass);

    // Close query
    $prepared_query->close();
}


function modifyCart(&$connection){
    $delete_cart_item = json_decode(($_POST['delete_cart_item']));
    $update_cart_item = json_decode(($_POST['update_cart_item']));
    $insert_cart_item = json_decode(($_POST['insert_cart_item']));
    $user_id = intval($_POST['user_id']);

    // Create query, prepare and bind parameters for delete
    $query_template = "DELETE FROM Cart WHERE (user_id = ?) AND (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    foreach ($delete_cart_item as $food_id){
        $prepared_query->bind_param("ii", $user_id, $food_id);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();


    // Create query, prepare and bind parameters for update
    $query_template = "UPDATE Cart SET food_num = ? WHERE (user_id = ?) AND (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    foreach ($update_cart_item as $food_id => $food_num){
        $prepared_query->bind_param("iii", $food_num, $user_id, $food_id);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();


    // Create query, prepare and bind parameters for delete
    $query_template = "INSERT INTO Cart VALUES (?, ?, ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    foreach ($insert_cart_item as $food_id => $food_num){
        $prepared_query->bind_param("iii", $user_id, $food_id, $food_num);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();

    echo "Modify Success";
}


// Close connection
$connection->close();

?>