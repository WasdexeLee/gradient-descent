<?php

// Enum to address different food details
enum OrderTable: int
{
    case ID = 0;
    case PHONE = 1;
    case TIME = 2;
}


enum OrderItem: int
{
    case ID = 0;
    case NUM = 1;
    case NAME = 2;
    case PREP = 3;
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
    if ($_POST['func'] === 'getOrder')
        getOrder($connection);
    else if ($_POST['func'] === 'deleteOrder')
        deleteOrder($connection);
}


function getOrder(&$connection)
{
    // Get order first, then only get orderItem seperately as we dont want to join the tables as it will be very intensive


    // Init array to store response
    $result = [];
    $orders = [];
    $orderItems = [];
    $compile = [];

    // Create query, prepare and bind parameters
    $query_template = "SELECT order_id, order_cust_phone, order_time_placed FROM OrderTable WHERE (order_completed = FALSE)";
    $prepared_query = $connection->prepare($query_template);


    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[OrderTable::ID->value], $result[OrderTable::PHONE->value], $result[OrderTable::TIME->value]);

    // Fetch all response from server
    while ($prepared_query->fetch())
        $orders[] = [$result[OrderTable::ID->value], $result[OrderTable::PHONE->value], $result[OrderTable::TIME->value]];

    // Close query
    $prepared_query->close();




    // Create query, prepare and bind parameters
    $query_template = "SELECT Food.food_id, food_num, Food.food_name, Food.food_prep_time FROM OrderItem JOIN Food ON OrderItem.food_id = Food.food_id WHERE (order_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Goes through all orders
    foreach ($orders as $order) {
        // Init array to store all item of one order
        $orderItem = [];

        // Bind parameter to query 
        $prepared_query->bind_param("i", $order[OrderTable::ID->value]);

        // Execute query and bind results to array
        $prepared_query->execute();
        $prepared_query->bind_result($result[OrderItem::ID->value], $result[OrderItem::NUM->value], $result[OrderItem::NAME->value], $result[OrderItem::PREP->value]);

        // Fetch all response from server
        while ($prepared_query->fetch())
            $orderItem[] = [$result[OrderItem::ID->value], $result[OrderItem::NUM->value], $result[OrderItem::NAME->value], $result[OrderItem::PREP->value]];

        // Push all item of one order into array of orders 
        $orderItems[$order[OrderTable::ID->value]] = $orderItem;
    }

    // Close query
    $prepared_query->close();


    // Combine both objects into one associative array
    $compile = ["orders" => $orders, "orderItems" => $orderItems];


    echo json_encode($compile);
}


function deleteOrder(&$connection)
{

}

?>