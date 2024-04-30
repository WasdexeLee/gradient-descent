<?php

require_once 'session_config.php';
require_once 'database_config.php';


// Start session and get user_id
session_start();
$user_id = $_SESSION['user_id'];


// Determine the type of request and call the appropriate function
if (isset($_POST['func'])) {
    if ($_POST['func'] === 'getUser')
        getUserInfo($connection, $user_id);
    else if ($_POST['func'] === 'modifyUser')
        updateUserInfo($connection, $user_id);
    else if ($_POST['func'] === 'logOut')
        logOut();
}


// Function to get user information
function getUserInfo(&$connection, $user_id)
{
    // Notify client incoming response is json
    header('Content-Type: application/json');

    // Create query, prepare and bind parameters
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
function updateUserInfo(&$connection, $user_id)
{
    // Notify client incoming response is text
    header('Content-Type: text/plain');

    // Create query, prepare and bind parameters
    $username = $_POST['user_name'];
    $email = $_POST['user_email'];
    $address = $_POST['user_address'];
    $phone = $_POST['user_phone'];
    $query = "UPDATE user SET user_name = ?, user_email = ?, user_address = ?, user_phone = ? WHERE user_id = ?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("ssssi", $username, $email, $address, $phone, $user_id);


    // Execute query
    if ($stmt->execute())
        echo "Profile updated successfully!";
    else
        echo "Error updating profile.";


    $stmt->close();
}


function logOut()
{
    // Unset all of the session variables
    $_SESSION = array();


    // Delete the session cookie.
    if (ini_get("session.use_cookies")) {
        $params = session_get_cookie_params();
        setcookie(
            session_name(),
            '',
            time() - 42000,
            $params["path"],
            $params["domain"],
            $params["secure"],
            $params["httponly"]
        );
    }


    // Destroy session
    session_destroy();
}


// Close database connection
$connection->close();

?>