<?php

// Enum to address different food details
enum Cart: int
{
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

if ($connection->connect_error) {
    die("Connnection ERROR !!!  " . $connection->connect_error);
}


if (isset($_POST['func'])) {
    if ($_POST['func'] === 'getUserInfo')
        getUserInfo($connection);
    else if ($_POST['func'] === 'getCart')
        getCart($connection);
    else if ($_POST['func'] === 'insertOrder')
        insertOrder($connection);
}


function getUserInfo(&$connection)
{
    // Create query, prepare and bind parameters
    $query_template = "SELECT user_name, user_phone, user_address FROM User WHERE (user_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    $user_id = intval($_POST['user_id']);

    $prepared_query->bind_param("i", $user_id);

    // Init array to store response
    $result = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[0], $result[1], $result[2]);

    // Fetch response from server
    $prepared_query->fetch();

    echo json_encode($result);

    // Close query
    $prepared_query->close();
}


function getCart(&$connection)
{
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


function insertOrder(&$connection)
{
    // Insert into OrderTable
    $user_id = intval($_POST['user_id']);

    $order_cust_name = $_POST['order_cust_name'];
    $order_cust_phone = $_POST['order_cust_phone'];
    $order_cust_address = $_POST['order_cust_address'];
    $order_payment_method = $_POST['order_payment_method'];
    $order_delivery_instruction = $_POST['order_delivery_instruction'];

    $order_item = json_decode(($_POST['order_item']));

    // Create query, prepare and bind parameters for delete
    $query_template = "INSERT INTO OrderTable VALUES (NULL, ?, ?, ?, ?, NULL, ?, NULL, ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    $prepared_query->bind_param("isssss", $user_id, $order_cust_name, $order_cust_phone, $order_cust_address, $order_payment_method, $order_delivery_instruction);
    $prepared_query->execute();

    // Close query
    $prepared_query->close();




    // Get order_id
    // Create query, prepare and bind parameters for delete
    $query_template = "SELECT order_id FROM OrderTable ORDER BY order_id DESC LIMIT 1";
    $prepared_query = $connection->prepare($query_template);

    // Init var to store result
    $order_id = "";

    // Bind parameter to query 
    $prepared_query->execute();
    $prepared_query->bind_result($order_id);

    // Fetch order_id
    $prepared_query->fetch();

    // Format order_id
    $order_id = intval($order_id);

    // Close query
    $prepared_query->close();




    // Insert order_item(s) into OrderItem
    // Create query, prepare and bind parameters for delete
    $query_template = "INSERT INTO OrderItem VALUES (?, ?, ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    foreach ($order_item as $item) {
        $prepared_query->bind_param("iii", $order_id, $item[0], $item[1]);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();

    echo "Modify Success";
}


// Close connection
$connection->close();

?>