document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    if (localStorage.getItem('user_id') === null)
        window.location.href = '../html/login.html';


    // Init array to store all username
    let foodDetail = [];
    // Init enum to make code more readable
    const Cart = Object.freeze({
        ID: 0,
        NUM: 1,
        NAME: 2,
        CATEGORY_ID: 3,
        PRICE: 4,
        AVAILABILITY: 5,
        IMAGE: 6,
    })
    // Variable to store cart items
    let cartItem = [];
    // Array to store all numICDiv and price
    let numICDivArr, priceArr;
    // Element Item and Subtotal in footer 
    let footerItem = document.querySelector('.col-lg-7.text-left.total-item')
    let footerSubtotal = document.querySelector('.subtotal-price');




    // Get all food items in cart of current user 
    getCart()
        .then(() => dynamicLoadCard())
        .then(() => buttonListener())
        .then(() => updateFooter());
        

    window.addEventListener('beforeunload', function () {
        console.log('Page is unloading!');
        modifyCart();
    });


    // Function to dynamically load card of cart item into webpage
    function dynamicLoadCard() {
        const foodItemContainer = document.getElementById('food-item-col');
        let currentRow;
        let col12, card, innerRow, col3, foodImg, col9, cardBody, cardTitle, btnRm, rmImg, numICDiv, btnAdd, addImg, btnAvailDiv, btnDiv, avail, cardDel, cardDelSmall, cardPrice;
        cartItem.forEach(item => {
            currentRow = document.createElement('div');
            currentRow.className = 'row';
            foodItemContainer.appendChild(currentRow);

            col12 = document.createElement('div');
            col12.className = 'col-lg-12';
            card = document.createElement('div');
            card.className = 'card';
            innerRow = document.createElement('div');
            innerRow.className = 'row no-gutters';

            card.appendChild(innerRow);
            col12.appendChild(card);
            currentRow.appendChild(col12);


            col3 = document.createElement('div');
            col3.className = 'col-md-3';
            foodImg = document.createElement('img');
            foodImg.className = 'img-fluid';
            foodImg.src = item[Cart.IMAGE];

            innerRow.appendChild(col3);
            col3.appendChild(foodImg);


            col9 = document.createElement('div');
            col9.className = 'col-md-9';
            cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = item[Cart.NAME];

            cardBody.appendChild(cardTitle);
            col9.appendChild(cardBody);
            innerRow.appendChild(col9);


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
            numICDiv.id = item[Cart.ID];
            numICDiv.className = 'num-in-cart';
            numICDiv.textContent = item[Cart.NUM];
            btnAdd = document.createElement('button');
            btnAdd.type = 'button';
            btnAdd.className = 'btn btn-primary btnAdd';
            addImg = document.createElement('img');
            addImg.src = '../webpage-image/icon-plus.svg';
            avail = document.createElement('small');
            avail.className = 'card-text text-muted avail';
            avail.textContent = item[Cart.AVAILABILITY].toString() + ' available';

            btnRm.appendChild(rmImg);
            btnAdd.appendChild(addImg);
            btnDiv.appendChild(btnRm);
            btnDiv.appendChild(numICDiv);
            btnDiv.appendChild(btnAdd);
            btnAvailDiv.appendChild(btnDiv);
            btnAvailDiv.appendChild(avail);
            cardBody.appendChild(btnAvailDiv);


            cardPrice = document.createElement('p');
            cardPrice.className = 'card-text price';
            item[Cart.PRICE] = item[Cart.PRICE].toFixed(2);
            cardPrice.textContent = "RM " + (item[Cart.PRICE] * item[Cart.NUM]).toFixed(2).toString();
            cardDel = document.createElement('p');
            cardDel.className = 'card-text txt-del';
            cardDel.id = item[Cart.ID];
            cardDelSmall = document.createElement('small');
            cardDelSmall.textContent = "Remove from Cart";

            cardBody.appendChild(cardPrice);
            cardDel.appendChild(cardDelSmall);
            cardBody.appendChild(cardDel);
        })

        numICDivArr = document.querySelectorAll('.num-in-cart');
        priceArr = document.querySelectorAll('.card-text.price');
    }


    function buttonListener() {
        // Get container which is the food-item-col column which contains all food items column
        const container = document.getElementById('food-item-col');
        let numICDiv, parentDiv, availDiv;

        container.addEventListener('click', event => {
            if (event.target.className === 'btn btn-primary btnRm') {
                numICDiv = event.target.nextElementSibling;
                if (parseInt(numICDiv.textContent) > 0) {
                    if (parseInt(numICDiv.textContent) === 1)
                        warnUserDelete(numICDiv);
                    else {
                        // Reduce the number-in-cart div by 1 
                        numICDiv.textContent = parseInt(numICDiv.textContent) - 1;
                        // Obtain the cardBody which contains the targeted element
                        cardBody = event.target.closest('.card-body');
                        // Traverse to the first element with class .car-text.price
                        price = cardBody.querySelector('.card-text.price');
                        // Set price element textContent to the price of product of num of item and price
                        price.textContent = "RM " + (cartItem[inCart(numICDiv, cartItem)][Cart.PRICE] * parseInt(numICDiv.textContent)).toFixed(2).toString();
                        // Call updateFooter() function to update the footer
                        updateFooter();
                    }
                }
            }


            if (event.target.className === 'btn btn-primary btnAdd') {
                numICDiv = event.target.previousElementSibling;
                parentDiv = event.target.parentElement;
                availDiv = parentDiv.nextElementSibling;
                if (parseInt(numICDiv.textContent) < parseInt(availDiv.textContent)) {
                    // Increase the number-in-cart div by 1
                    numICDiv.textContent = parseInt(numICDiv.textContent) + 1;
                    // Obtain the cardBody which contains the targeted element
                    cardBody = event.target.closest('.card-body');
                    // Traverse to the first element with class .car-text.price
                    price = cardBody.querySelector('.card-text.price');
                    // Set price element textContent to the price of product of num of item and price
                    price.textContent = "RM " + (cartItem[inCart(numICDiv, cartItem)][Cart.PRICE] * parseInt(numICDiv.textContent)).toFixed(2).toString();
                    // Call updateFooter() function to update the footer
                    updateFooter();
                }
            }

            if (event.target.className === 'card-text txt-del')
                warnUserDelete(event.target);
        });
    }


    function getCart() {
        // Get all details of every cart food item from database
        formData = new FormData();
        formData.append('func', 'getCart');
        formData.append('user_id', localStorage.getItem('user_id'));
        // Call login.php script and take response from script, convert to json array, push all rows in json array to prevCartItem 2D array and catch error
        return fetch('../php-script/cart.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => table.forEach(row => cartItem.push(row)))
            .catch(error => console.error('ERROR: ', error));
    }


    function inCart(item, cartItem) {
        // Set to -1
        let locIndex = -1;

        // Loop through all item in cart
        for (let row = 0; row < cartItem.length; row++) {
            // If the item passed as parameter's id is equal to the item looped from the cart, then item found and return the index of the item
            if (parseInt(item.id) === cartItem[row][0])
                locIndex = row;
        }
        // Return locIndex, if -1, item not found, else item found
        return locIndex;
    }


    function modifyCart() {
        // Create json object to be passed to php (either to delete, update or insert to table)
        let updateCartItem = {};
        // Get all .num-in-cart which contains number of items in cart 
        const foodList = document.querySelectorAll('.num-in-cart');

        // Checks through for changes to cart and carries out necessary changes ie. delete, update, insert
        foodList.forEach(item => {
            // Find index of item in cart
            let itemIndex = inCart(item, cartItem);

            // If the num-in-cart div text content is not equal to the number of item from the cartItem list pulled from database
            // Push to JSON updateCartItem to be passed to php
            if (parseInt(item.textContent) !== cartItem[itemIndex][Cart.NUM])
                updateCartItem[parseInt(item.id)] = parseInt(item.textContent);
        });

        // Append cart data into FormData object to pass to php
        let locFormData = new FormData();

        // Append necessary info for php
        locFormData.append('func', 'modifyCart');
        locFormData.append('user_id', localStorage.getItem('user_id'));
        locFormData.append('update_cart_item', JSON.stringify(updateCartItem));

        // Call fetch API to pass data to menu.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('../php-script/cart.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));
    }


    function deleteItem(item) {
        // Append cart data into FormData object to pass to php
        let locFormData = new FormData();

        locFormData.append('func', 'deleteItem');
        locFormData.append('user_id', localStorage.getItem('user_id'));
        locFormData.append('delete_cart_item', item.id);

        // Call fetch API to pass data to menu.php
        // Use POST method, passes locFormData, wait for response and log to console
        return fetch('../php-script/cart.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));
    }


    function warnUserDelete(item) {
        // Toggle the modal to display using ID 
        $('#warnUserDeleteModal').modal('toggle');

        // Get the modalBody which will be used to insert the name of the item to be removed
        const modalBody = document.getElementById('modalBody');

        // Finds the index of the item and retrieve its name from cartItem using the index and write to modalBody
        modalBody.textContent = cartItem[inCart(item, cartItem)][Cart.NAME];

        // Add event listener to yes-button
        // On click, removes the item selected using deleteItem function
        // Next, calls page to reload
        document.getElementById('yes-button').addEventListener('click', () => {
            deleteItem(item)
                .then(() => location.reload());
        })
    }


    function updateFooter() {
        // Init item and subtotal to 0 and sum on later
        item = 0;
        subtotal = 0;

        // Loop through all numICDiv and price to obtain each item's item and price and sum it up
        for (let numICDiv of numICDivArr)
            item += parseInt(numICDiv.textContent);

        for (let price of priceArr)
            subtotal += parseFloat(price.textContent.slice(3));

        // Write to the footer's element
        footerItem.textContent = "Items (" + item.toString() + ")";
        footerSubtotal.textContent = subtotal.toFixed(2).toString();
    }
});