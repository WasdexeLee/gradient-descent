document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    if (localStorage.getItem('user_id') === null)
        window.location.href = '../html/login.html';


    // Init array to store food detail
    let foodDetail = [];
    // Init enum to make code more readable
    const Food = Object.freeze({
        ID: 0,
        NAME: 1,
        CATEGORY_ID: 2,
        DESCRIPTION: 3,
        PRICE: 4,
        AVAILABILITY: 5,
        IMAGE: 6,
        PREP_TIME: 7,
        NUM_SOLD: 8
    })
    // Init boolean to check whether in col 1 or 2 to determine whether to create new row or not
    let col2 = false;
    // Get cart icon to add event listener
    const cartIcon = document.getElementById('navbar-cart');
    // Variable to store previous cart items
    let prevCartItem = [];




    getFoodDetail().then(() => {
        getCart()
            .then(() => dynamicLoadCard())
            .then(() => buttonListener())
            .then(() => addCartEventListener());
    });


    // Every change in webpage size, checks number of line of title and change description length to accomodate title
    window.addEventListener('resize', checkTitleLine());

    window.addEventListener('beforeunload', function () {
        console.log('Page is unloading!');
        updateCart();
    });


    function getFoodDetail() {
        // Get all details of every food item from database and sort according to category
        let formData = new FormData();
        formData.append('func', 'getFoodDetail');
        // Call login.php script and take response from script, convert to json array, push all rows in json array to foodDetail 2D array and catch error
        return fetch('../php-script/menu.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => table.forEach(row => foodDetail.push(row)))
            .catch(error => console.error('ERROR: ', error))
            .then(() => foodDetail.sort((a, b) => a[Food.CATEGORY_ID] - b[Food.CATEGORY_ID]));
    }


    // Function to dynamically load card of food item into webpage
    function dynamicLoadCard() {
        const foodItemContainer = document.getElementById('food-item-col');
        let currentRow;
        let col6, card, innerRow, col4, foodImg, col8, cardBody, cardTitle, cardDesc, cardPrice, btnRm, rmImg, numICDiv, btnAdd, addImg, btnAvailDiv, btnDiv, avail;
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

            card.appendChild(innerRow);
            col6.appendChild(card);
            currentRow.appendChild(col6);


            col4 = document.createElement('div');
            col4.className = 'col-md-4';
            foodImg = document.createElement('img');
            foodImg.className = 'img-fluid';
            foodImg.src = item[Food.IMAGE];

            innerRow.appendChild(col4);
            col4.appendChild(foodImg);


            col8 = document.createElement('div');
            col8.className = 'col-md-8';
            cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = item[Food.NAME];
            cardDesc = document.createElement('p');
            cardDesc.className = 'card-text desc-twol';
            cardDesc.textContent = item[Food.DESCRIPTION];
            cardPrice = document.createElement('p');
            cardPrice.className = 'card-text price';
            item[Food.PRICE] = item[Food.PRICE].toFixed(2);
            cardPrice.textContent = "RM " + item[Food.PRICE].toString();

            cardBody.appendChild(cardTitle);
            cardBody.appendChild(cardDesc);
            cardBody.appendChild(cardPrice);
            col8.appendChild(cardBody);
            innerRow.appendChild(col8);


            btnAvailDiv = document.createElement('div');
            btnAvailDiv.className = 'button-avail-div';
            btnDiv = document.createElement('div');
            btnDiv.className = 'button-div';
            btnRm = document.createElement('button');
            btnRm.type = 'button';
            btnRm.className = 'btn btn-primary btnRm';
            rmImg = document.createElement('img');
            rmImg.src = '../webpage-image/icon-minus.svg';
            numICDiv = document.createElement('div');
            numICDiv.id = item[Food.ID];
            numICDiv.className = 'num-in-cart';

            let itemIndex = inCart(numICDiv, prevCartItem);
            if (itemIndex >= 0)
                numICDiv.textContent = prevCartItem[itemIndex][1];
            else
                numICDiv.textContent = 0;

            btnAdd = document.createElement('button');
            btnAdd.type = 'button';
            btnAdd.className = 'btn btn-primary btnAdd';
            addImg = document.createElement('img');
            addImg.src = '../webpage-image/icon-plus.svg';
            avail = document.createElement('small');
            avail.className = 'card-text text-muted avail';
            avail.textContent = item[Food.AVAILABILITY].toString() + ' available';


            btnRm.appendChild(rmImg);
            btnAdd.appendChild(addImg);
            btnDiv.appendChild(btnRm);
            btnDiv.appendChild(numICDiv);
            btnDiv.appendChild(btnAdd);
            btnAvailDiv.appendChild(btnDiv);
            btnAvailDiv.appendChild(avail);
            cardBody.appendChild(btnAvailDiv);
        })

        checkTitleLine();
    }


    function checkTitleLine() {
        // Get all card-title div(s)
        const cardTitleArray = document.querySelectorAll('.card-title');
        // Declare vars
        let lineHeight, clientHeight, displayRows, descP;

        // Go through all div(s)
        // If displaying 2 or more rows, change style to 1 line description
        // If displaying 1 row, change style to 2 line description
        cardTitleArray.forEach(elem => {
            lineHeight = parseFloat(window.getComputedStyle(elem).lineHeight);
            clientHeight = elem.clientHeight;
            displayRows = clientHeight / lineHeight;

            if (displayRows > 1) {
                descP = elem.nextElementSibling;
                descP.classList.remove('desc-twol');
                descP.classList.add('desc-onel');
            }
            else if (displayRows <= 1) {
                descP = elem.nextElementSibling;
                descP.classList.remove('desc-onel');
                descP.classList.add('desc-twol');
            }
        });
    }


    function buttonListener() {
        // Get all card-body to add event listener
        const container = document.getElementById('food-item-col');
        let numICDiv, parentDiv, availDiv;

        container.addEventListener('click', event => {
            if (event.target.className === 'btn btn-primary btnRm') {
                numICDiv = event.target.nextElementSibling;
                if (parseInt(numICDiv.textContent) > 0)
                    numICDiv.textContent = parseInt(numICDiv.textContent) - 1;
            }

            if (event.target.className === 'btn btn-primary btnAdd') {
                numICDiv = event.target.previousElementSibling;
                parentDiv = event.target.parentElement;
                availDiv = parentDiv.nextElementSibling;
                if (parseInt(numICDiv.textContent) < parseInt(availDiv.textContent))
                    numICDiv.textContent = parseInt(numICDiv.textContent) + 1;
            }
        });
    }


    function inCart(item, prevCartItem) {
        let locIndex = -1;
        for (let row = 0; row < prevCartItem.length; row++) {
            if (parseInt(item.id) === prevCartItem[row][0])
                locIndex = row;
        }
        return locIndex;
    }


    function addCartEventListener() {
        cartIcon.addEventListener('click', () => {
            // getCart()
            // .then(() => updateCart());
            updateCart();

            window.location.href = '../html/cart.html';
        });
    }


    function getCart() {
        // Get all details of every cart food item from database
        formData = new FormData();
        formData.append('func', 'getCart');
        formData.append('user_id', parseInt(localStorage.getItem('user_id')));
        // Call login.php script and take response from script, convert to json array, push all rows in json array to prevCartItem 2D array and catch error
        return fetch('../php-script/menu.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => table.forEach(row => prevCartItem.push(row)))
            .catch(error => console.error('ERROR: ', error));
    }


    function updateCart() {
        // Create json object to be passed to php (either to delete, update or insert to table)
        let deleteCartItem = [];
        let updateCartItem = {};
        let insertCartItem = {};
        // Get all .num-in-cart which contains number of items in cart 
        const foodList = document.querySelectorAll('.num-in-cart');

        // Checks through for changes to cart and carries out necessary changes ie. delete, update, insert
        foodList.forEach(item => {
            let itemIndex = inCart(item, prevCartItem);

            if (itemIndex >= 0) {
                if (parseInt(item.textContent) === 0)
                    deleteCartItem.push(parseInt(item.id));

                else if (parseInt(item.textContent) !== prevCartItem[itemIndex][1])
                    updateCartItem[parseInt(item.id)] = parseInt(item.textContent);
            }
            else {
                if (parseInt(item.textContent) > 0)
                    insertCartItem[item.id] = parseInt(item.textContent);
            }
        });


        // Append cart data into FormData object to pass to php
        let locFormData = new FormData();

        locFormData.append('func', 'modifyCart');
        locFormData.append('user_id', localStorage.getItem('user_id').toString());
        locFormData.append('delete_cart_item', JSON.stringify(deleteCartItem));
        locFormData.append('update_cart_item', JSON.stringify(updateCartItem));
        locFormData.append('insert_cart_item', JSON.stringify(insertCartItem));

        // Call fetch API to pass data to menu.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('../php-script/menu.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));
    }
});