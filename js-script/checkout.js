document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    if (localStorage.getItem('user_id') === null)
        window.location.href = '../html/login.html';

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





    // Function to dynamically load card of cart item into webpage
    function dynamicLoadItem() {
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
        footerSubtotal.textContent = "RM " + subtotal.toFixed(2).toString();
    }
});