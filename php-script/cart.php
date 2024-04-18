<?php 

// Enum to address different food details
enum Cart: int {
    case ID = 0;
    case NUM = 1;
    case NAME = 2;
    case CATEGORY_ID = 3;
    case PRICE = 4;
    case AVAILABILITY = 5;
    case IMAGE = 6;
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
    if ($_POST['func'] === 'getCart')
        getCart($connection);
    else if ($_POST['func'] === 'modifyCart')
        modifyCart($connection);
    else if ($_POST['func'] === 'deleteItem')
        deleteItem($connection);
}


function getCart(&$connection){
    // Create query, prepare and bind parameters
    $query_template = "SELECT Cart.food_id, food_num, food_name, food_category_id, food_price, food_availability, food_image FROM Cart JOIN Food ON Cart.food_id = Food.food_id WHERE (user_id = ?) ORDER BY food_category_id";
    $prepared_query = $connection->prepare($query_template);

    $user_id = intval($_POST['user_id']);
    
    $prepared_query->bind_param("i", $user_id);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[Cart::ID->value], $result[Cart::NUM->value], $result[Cart::NAME->value], $result[Cart::CATEGORY_ID->value], $result[Cart::PRICE->value], $result[Cart::AVAILABILITY->value], $result[Cart::IMAGE->value]);

    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[Cart::ID->value], $result[Cart::NUM->value], $result[Cart::NAME->value], $result[Cart::CATEGORY_ID->value], $result[Cart::PRICE->value], $result[Cart::AVAILABILITY->value], $result[Cart::IMAGE->value]];

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

    echo "Modify Success";
}


function deleteItem(&$connection){
    $user_id = intval($_POST['user_id']);
    $food_id = intval($_POST['delete_cart_item']);

    // Create query, prepare and bind parameters for delete
    $query_template = "DELETE FROM Cart WHERE (user_id = ?) AND (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
        $prepared_query->bind_param("ii", $user_id, $food_id);
        $prepared_query->execute();

    // Close query
    $prepared_query->close();

    echo "Modify Success";
}


// Close connection
$connection->close();

?>