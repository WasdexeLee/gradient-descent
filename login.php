<?php 

$host = "localhost";
$username = "root";
$password = "";
$dbname = "capybaraexpress";


$connection = new mysqli($host, $username, $password, $dbname);

if ($connection->connect_error){
    die("Connnectino ERROR !!!  " . $connection->connect_error);
}


$query_template = "SELECT user_name, user_password, user_operator FROM User";
$prepared_query = $connection->prepare($query_template);

// $param = ["song_title", "Song"];
// $prepared_query->bind_param("ss", $param);

$prepared_query->execute();
    
// $result = $prepared_query->get_result();
$result = [];
$pass = [];

$prepared_query->bind_result($result[0], $result[1], $result[2]);

while ($prepared_query->fetch()){
    $temp = [$result[0], $result[1], $result[2]];
    $pass[] = $temp;
}

echo json_encode($pass);


$prepared_query->close();


?>