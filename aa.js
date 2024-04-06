// Creating a FormData object
var formData = new FormData();
formData.append('name', name);

// Sending the data to the server using fetch
fetch('process.php', {
    method: 'POST',
    body: formData,
})
.then(response => response.text())
.then(data => {
    console.log(data); // Process the response data
})
.catch(error => {
    console.error('Error:', error); // Handle the error if any
});


if (isset($_POST['name'])) {
    $name = htmlspecialchars($_POST['name']); // Sanitize the input
    echo "Hello, " . $name . "!"; // Send a response back
} else {
    echo "Name not received.";
}















document.addEventListener("DOMContentLoaded", function() {
        fetch('ha.php')
        .then(phpResponse => phpResponse.json())
        .then(table => dynamicLoadCard(table))
        .catch(error => console.error('Errrooooorrrr: ', error));
})



function dynamicLoadCard(table) { 
    const div = document.getElementById('card_container');
    table.forEach(row => {
            const cardDiv = document.createElement('div');
            cardDiv.className = 'card';
            const songTitle = document.createElement('h3');
            songTitle.textContent = row;
            cardDiv.appendChild(songTitle);

            const descDiv = document.createElement('div');
            descDiv.className = 'desc';
            const desc = document.createElement('p');
            desc.textContent = 'dessss';
            descDiv.appendChild(desc);

            cardDiv.appendChild(descDiv);
            div.appendChild(cardDiv);
    });
}


