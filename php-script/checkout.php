<?php

require_once 'session_config.php';
require_once 'database_config.php';


// Enum to address different food details
enum Cart: int
{
    case ID = 0;
    case NUM = 1;
    case NAME = 2;
    case PRICE = 3;
    case AVAILABILITY = 4;
    case IMAGE = 5;
    case SOLD = 6;
}


// Start session and get user_id
session_start();
$user_id = $_SESSION['user_id'];


// Logic for function selection
if (isset($_POST['func'])) {
    if ($_POST['func'] === 'getUserInfo')
        getUserInfo($connection, $user_id);
    else if ($_POST['func'] === 'getCart')
        getCart($connection, $user_id);
    else if ($_POST['func'] === 'insertOrder')
        insertOrder($connection, $user_id);
}


function getUserInfo(&$connection, $user_id)
{
    // Create query, prepare and bind parameters
    $query_template = "SELECT user_name, user_phone, user_address FROM User WHERE (user_id = ?)";
    $prepared_query = $connection->prepare($query_template);

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


function getCart(&$connection, $user_id)
{
    // Create query, prepare and bind parameters
    $query_template = "SELECT Cart.food_id, food_num, food_name, food_price, food_availability, food_image, food_num_sold FROM Cart JOIN Food ON Cart.food_id = Food.food_id WHERE (user_id = ?) ORDER BY food_category_id";
    $prepared_query = $connection->prepare($query_template);

    $prepared_query->bind_param("i", $user_id);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[Cart::ID->value], $result[Cart::NUM->value], $result[Cart::NAME->value], $result[Cart::PRICE->value], $result[Cart::AVAILABILITY->value], $result[Cart::IMAGE->value], $result[Cart::SOLD->value]);

    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[Cart::ID->value], $result[Cart::NUM->value], $result[Cart::NAME->value], $result[Cart::PRICE->value], $result[Cart::AVAILABILITY->value], $result[Cart::IMAGE->value], $result[Cart::SOLD->value]];

    echo json_encode($pass);

    // Close query
    $prepared_query->close();
}


function insertOrder(&$connection, $user_id)
{
    $order_cust_name = $_POST['order_cust_name'];
    $order_cust_phone = $_POST['order_cust_phone'];
    $order_cust_address = $_POST['order_cust_address'];
    $order_payment_method = $_POST['order_payment_method'];
    $order_kitchen_instruction = $_POST['order_kitchen_instruction'];
    $order_delivery_instruction = $_POST['order_delivery_instruction'];

    $order_item = json_decode(($_POST['order_item']));

    // Create query, prepare and bind parameters for delete
    $query_template = "INSERT INTO OrderTable VALUES (NULL, ?, ?, ?, ?, DEFAULT, ?, DEFAULT, ?, ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    $prepared_query->bind_param("issssss", $user_id, $order_cust_name, $order_cust_phone, $order_cust_address, $order_payment_method, $order_delivery_instruction, $order_kitchen_instruction);
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
        $prepared_query->bind_param("iii", $order_id, $item[Cart::ID->value], $item[Cart::NUM->value]);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();




    // Delete cart items for the user placing the order
    // Create query, prepare and bind parameters for delete
    $query_template = "DELETE FROM Cart WHERE (user_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    $prepared_query->bind_param("i", $user_id);
    $prepared_query->execute();

    // Close query
    $prepared_query->close();




    // Create query, prepare and bind parameters for update
    $query_template = "UPDATE Food SET food_availability = ?, food_num_sold = ? WHERE (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    foreach ($order_item as $item) {
        $temp_avail = $item[Cart::AVAILABILITY->value] - $item[Cart::NUM->value];
        $temp_sold = $item[Cart::SOLD->value] + $item[Cart::NUM->value];
        $prepared_query->bind_param("iii", $temp_avail, $temp_sold, $item[Cart::ID->value]);
        $prepared_query->execute();
    }

    // Close query
    $prepared_query->close();

    echo "Modify Success";
}


// Close connection
$connection->close();

?>