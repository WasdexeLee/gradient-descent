<?php 

$host = "localhost";
$username = "root";
$password = "";
$dbname = "lab3,4";


$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error){
    die("Connnectino ERROR !!!  " . $connection->connect_error);
}


$query_template = "SELECT song_title FROM Song";
$prepared_query = $connection->prepare($query_template);

// $param = ["song_title", "Song"];

// $prepared_query->bind_param("ss", $param);

$prepared_query->execute();

$result = ["", ""];
$pass = [];

$prepared_query->bind_result($result[0]);

while ($prepared_query->fetch()){
    // echo "hihihihi     " . $result[0] . "<br>";
    $pass[] = $result[0];
}

echo json_encode($pass);

$prepared_query->close();


?>