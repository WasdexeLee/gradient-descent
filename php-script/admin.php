<?php

// Enum to address different food details
enum Food: int
{
    case ID = 0;
    case NAME = 1;
    case CATEGORY_ID = 2;
    case CATEGORY_NAME = 3;
    case DESCRIPTION = 4;
    case PRICE = 5;
    case AVAILABILITY = 6;
    case IMAGE = 7;
    case PREP_TIME = 8;
    case NUM_SOLD = 9;
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
    if ($_POST['func'] === 'getFoodItem')
        getFoodItem($connection);
    else if ($_POST['func'] === 'modifyFoodItem')
        modifyFoodItem($connection);
    else if ($_POST['func'] === 'fileUpload')
        fileUpload($connection);
    else if ($_POST['func'] === 'deleteFoodItem')
        deleteFoodItem($connection);
}


function getFoodItem(&$connection)
{
    // Create query, prepare and bind parameters
    $query_template = "SELECT food_id, food_name, Food.food_category_id, food_category_name, food_description, food_price, food_availability, food_image, food_prep_time, food_num_sold FROM Food JOIN FoodCategory ON Food.food_category_id=FoodCategory.food_category_id";
    $prepared_query = $connection->prepare($query_template);

    // Init array to store response
    $result = [];
    $pass = [];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($result[Food::ID->value], $result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::CATEGORY_NAME->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]);


    // Fetch all response from server
    while ($prepared_query->fetch())
        $pass[] = [$result[Food::ID->value], $result[Food::NAME->value], $result[Food::CATEGORY_ID->value], $result[Food::CATEGORY_NAME->value], $result[Food::DESCRIPTION->value], $result[Food::PRICE->value], $result[Food::AVAILABILITY->value], $result[Food::IMAGE->value], $result[Food::PREP_TIME->value], $result[Food::NUM_SOLD->value]];


    // Encode into json formate and echo back to Javascript 
    echo json_encode($pass);

    // Close query
    $prepared_query->close();
}


function modifyFoodItem(&$connection)
{
    // Get all values to be updated into the food table after admin has edited the items
    $food_id = intval($_POST['food_id']);
    $food_name = $_POST['food_name'];
    $food_category_id = intval($_POST['food_category_id']);
    $food_description = $_POST['food_description'];
    $food_price = floatval($_POST['food_price']);
    $food_availability = intval($_POST['food_availability']);
    $food_prep_time = intval($_POST['food_prep_time']);
    $food_num_sold = intval($_POST['food_num_sold']);

    // Create query, prepare and bind parameters for update
    $query_template = "UPDATE Food SET food_name = ?, food_category_id = ?,  food_description = ?, food_price = ?, food_availability = ?, food_prep_time = ?, food_num_sold = ? WHERE (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    $prepared_query->bind_param("sisdiiii", $food_name, $food_category_id, $food_description, $food_price, $food_availability, $food_prep_time, $food_num_sold, $food_id);
    $prepared_query->execute();

    // Close query
    $prepared_query->close();

    echo "Modify Success";
}


function fileUpload(&$connection)
{
    $target_dir = "../food-image/";
    $target_file_name = $target_dir . basename($_FILES["file_to_upload"]["name"]);

    if (move_uploaded_file($_FILES["file_to_upload"]["tmp_name"], $target_file_name)) {
        echo "File uploaded successfully.";
    } else {
        echo "Sorry, there was an error uploading your file.";
    }
}


function deleteFoodItem(&$connection)
{
    $food_id = intval($_POST['food_id']);

    // Create query, prepare and bind parameters for delete
    $query_template = "DELETE FROM Food WHERE (food_id = ?)";
    $prepared_query = $connection->prepare($query_template);

    // Bind parameter to query 
    $prepared_query->bind_param("i", $food_id);
    $prepared_query->execute();

    // Close query
    $prepared_query->close();

    echo "Delete Success";
}


// Close connection
$connection->close();

?>