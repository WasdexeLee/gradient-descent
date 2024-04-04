



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


