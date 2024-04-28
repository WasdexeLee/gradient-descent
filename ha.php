<?php 

// $host = "localhost";
// $username = "root";
// $password = "";
// $dbname = "lab3,4";





if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $targetDir = "food-image/"; // Specify the directory where files will be stored
    $targetFile = $targetDir . basename($_FILES["fileToUpload"]["name"]);

    // Check if the file is valid
    if (move_uploaded_file($_FILES["fileToUpload"]["tmp_name"], $targetFile)) {
        echo "File uploaded successfully!";
    } else {
        echo "Error uploading file.";
    }
}




// $connection = new mysqli($host, $username, $password, $dbname);

// if ($connection->connect_error){
//     die("Connnectino ERROR !!!  " . $connection->connect_error);
// }


// $query_template = "SELECT song_title FROM Song";
// $prepared_query = $connection->prepare($query_template);

// // $param = ["song_title", "Song"];

// // $prepared_query->bind_param("ss", $param);

// $prepared_query->execute();

// $result = ["", ""];
// $pass = [];

// $prepared_query->bind_result($result[0]);

// while ($prepared_query->fetch()){
//     // echo "hihihihi     " . $result[0] . "<br>";
//     $pass[] = $result[0];
// }

// echo json_encode($pass);

// $prepared_query->close();


?>