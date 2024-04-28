<?php

// Credentials 
$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";
//connection
$connection = new mysqli($host, $username, $password, $dbname);

// Check connection
if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}
// Determine the type of request and call the appropriate function
if (isset($_POST['func'])) {
    if($_POST['func'] === 'getUser'){
    getUserInfo($connection);
    }
    else if ($_POST['func'] === 'modifyUser'){
        // Fetch user information
        updateUserInfo($connection);
    }
} 

// Function to get user information
function getUserInfo(&$connection) {
    $user_id = intval($_POST['user_id']);
    
    $query_template = "SELECT user_name, user_email, user_address, user_phone FROM user WHERE user_id = ?";
    $prepared_query = $connection->prepare($query_template);
    $prepared_query->bind_param("i", $user_id);
    // Init array to store response
    $pass = [null, null, null, null];

    // Execute query and bind results to array
    $prepared_query->execute();
    $prepared_query->bind_result($pass[0], $pass[1], $pass[2], $pass[3]);
    $prepared_query->fetch();

    // Encode into json formate and echo back to Javascript 
    echo json_encode($pass);
    // Close query
    $prepared_query->close();

}

// Function to update user information
function updateUserInfo(&$connection) {
    $userId = intval($_POST['user_id']);
    $username = $_POST['user_name'];
    $email = $_POST['user_email'];
    $address = $_POST['user_address'];
    $phone = $_POST['user_phone'];
    $query = "UPDATE user SET user_name = ?, user_email = ?, user_address = ?, user_phone = ? WHERE user_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssi", $username, $email, $address, $phone, $userId);
    if ($stmt->execute()) {
        echo "Profile updated successfully!";
    } else {
        echo "Error updating profile.";
    }
    $stmt->close();
}

// Close database connection
$connection->close();

?>
