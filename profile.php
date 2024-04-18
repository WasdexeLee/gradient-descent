<?php
session_start();
include 'auth.php'; // Include authentication to verify the user

// Database connection parameters
$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";
$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error) {
    die("Connection failed: " . $connection->connect_error);
}

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    // Handle the form submission
    $email = $_POST['email'];
    $address = $_POST['address'];
    $phone = $_POST['phone'];
    $user_id = $_SESSION['user_id']; // Assuming user_id is stored in the session

    // Prepare and bind
    $stmt = $connection->prepare("UPDATE User SET user_email=?, user_address=?, user_phone=? WHERE user_id=?");
    $stmt->bind_param("sssi", $email, $address, $phone, $user_id);

    // Execute the query and check if the update was successful
    if ($stmt->execute()) {
        echo "Profile updated successfully.";
    } else {
        echo "Error updating profile: " . $stmt->error;
    }

    // Close statement and connection
    $stmt->close();
    $connection->close();
} else {
    // User is visiting the page, not submitting the form, fetch user's data
    $user_id = $_SESSION['user_id']; // Assuming user_id is stored in the session
    $query = "SELECT user_name, user_email, user_address, user_phone FROM User WHERE user_id=?";
    $stmt = $connection->prepare($query);
    $stmt->bind_param("i", $user_id);
    $stmt->execute();
    $stmt->bind_result($username, $email, $address, $phone);
    $stmt->fetch();

    // Close statement
    $stmt->close();
    $connection->close();

    // Populate the form fields with the fetched data using JavaScript or directly via PHP
    echo "<script>
            document.getElementById('username').value = '".htmlspecialchars($username)."';
            document.getElementById('email').value = '".htmlspecialchars($email)."';
            document.getElementById('address').value = '".htmlspecialchars($address)."';
            document.getElementById('phone').value = '".htmlspecialchars($phone)."';
          </script>";
}
?>
