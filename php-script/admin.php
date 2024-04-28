<?php
header('Content-Type: application/json');

$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";

$conn = new mysqli($host, $username, $password, $dbname);
if ($conn->connect_error) {
    echo json_encode(["error" => "Connection failed: " . $conn->connect_error]);
    exit;
}

$sql = "SELECT food_id, food_name, food_category_name, food_description, food_price, food_availability, food_image, food_prep_time, food_num_sold FROM Food JOIN FoodCategory ON Food.food_category_id=FoodCategory.food_category_id";
$result = $conn->query($sql);

$foods = [];
if ($result->num_rows > 0) {
    while($row = $result->fetch_assoc()) {
        $foods[] = $row;
    }
    echo json_encode($foods);
} else {
    echo json_encode(["error" => "No food items found"]);
}

$conn->close();
?>
