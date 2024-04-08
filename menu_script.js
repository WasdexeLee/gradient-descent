document.addEventListener('DOMContentLoaded', function () {
    // Init array to store all username
    let foodDetail = [];
    // Init enum to make code more readable
    const Food = Object.freeze({
        NAME: 0,
        CATEGORY_ID: 1,
        DESCRIPTION: 2,
        PRICE: 3,
        AVAILABILITY: 4,
        IMAGE: 5,
        PREP_TIME: 6,
        NUM_SOLD: 7
    })
    // Init boolean to check whether in col 1 or 2 to determine whether to create new row or not
    let col2 = false;


    // Get all details of every food item from database and sort according to category
    let formData = new FormData();
    formData.append('func', 'getFoodDetail');
    // Call login.php script and take response from script, convert to json array, push all rows in json array to foodDetail 2D array and catch error
    fetch('menu.php', { method: 'POST', body: formData, })
        .then(phpResponse => phpResponse.json())
        .then(table => table.forEach(row => foodDetail.push(row)))
        .catch(error => console.error('ERROR: ', error))
        .then(() => foodDetail.sort((a, b) => a[Food.CATEGORY_ID] - b[Food.CATEGORY_ID]))
        // .then(function () { console.log(foodDetail) })  //to remove
        .then(() => dynamicLoadCard());


    // Every change in webpage size, checks number of line of title and change description length to accomodate title
    window.addEventListener('resize', checkTitleLine);



    // Function to dynamically load card of food item into webpage
    function dynamicLoadCard() {
        const foodItemContainer = document.getElementById('food-item-col');
        let currentRow;
        let col6, card, innerRow, col4, foodImg, col8, cardBody, cardTitle, cardText, price, small, button, buttonImg;
        let priceText;
        foodDetail.forEach(item => {
            if (!col2) {
                currentRow = document.createElement('div');
                currentRow.className = 'row';
                foodItemContainer.appendChild(currentRow);
            }
            col2 = !col2;

            col6 = document.createElement('div');
            col6.className = 'col-lg-6';
            card = document.createElement('div');
            card.className = 'card';
            innerRow = document.createElement('div');
            innerRow.className = 'row no-gutters';

            col4 = document.createElement('div');
            col4.className = 'col-md-4';
            foodImg = document.createElement('img');
            foodImg.className = 'img-fluid';
            foodImg.src = item[Food.IMAGE];

            col4.appendChild(foodImg);
            innerRow.appendChild(col4);

            col8 = document.createElement('div');
            col8.className = 'col-md-8';
            cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = item[Food.NAME];
            cardText = document.createElement('p');
            cardText.className = 'card-text desc-twol';
            cardText.textContent = item[Food.DESCRIPTION];
            price = document.createElement('p');
            price.className = 'card-text price';
            small = document.createElement('small');
            small.className = 'text-muted';
            item[Food.PRICE] = item[Food.PRICE].toFixed(2);
            small.textContent = "RM " + item[Food.PRICE].toString();
            button = document.createElement('button');
            button.className = 'btn btn-primary btn-addtc';
            button.type = 'button';
            buttonImg = document.createElement('img');
            buttonImg.src = 'food-image/plus-white.svg';

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardText);
            price.appendChild(small);
            cardBody.appendChild(price);
            button.appendChild(buttonImg);
            cardBody.appendChild(button);

            col8.appendChild(cardBody);
            innerRow.appendChild(col8);

            card.appendChild(innerRow);
            col6.appendChild(card);
            currentRow.appendChild(col6);
        })

        checkTitleLine();
    }




    function checkTitleLine() {
        const cardTitleArray = document.querySelectorAll('.card-title');
        let lineHeight, clientHeight, displayRows, descP;

        cardTitleArray.forEach(elem => {
                        lineHeight = parseFloat(window.getComputedStyle(elem).lineHeight);
                        clientHeight = elem.clientHeight;
                        displayRows = clientHeight / lineHeight;

                        if (displayRows > 1){
                            descP = elem.nextElementSibling;
                            descP.classList.remove('desc-twol');
                            descP.classList.add('desc-onel');
                        }
                        else if (displayRows <= 1){
                            descP = elem.nextElementSibling;
                            descP.classList.remove('desc-onel');
                            descP.classList.add('desc-twol');
                        }
        });
    }
});