document.addEventListener('DOMContentLoaded', function () {
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




    // Get all food items in cart of current user 
    getCart()
        .then(() => dynamicLoadCard())
        .then(() => buttonListener())


    // Every change in webpage size, checks number of line of title and change description length to accomodate title
    window.addEventListener('resize', checkTitleLine);


    window.addEventListener('beforeunload', function () {
        console.log('Page is unloading!');
        updateCart();
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
            rmImg.src = 'webpage-image/icon-minus.svg';
            numICDiv = document.createElement('div');
            numICDiv.id = item[Cart.ID];
            numICDiv.className = 'num-in-cart';
            numICDiv.textContent = item[Cart.NUM];
            btnAdd = document.createElement('button');
            btnAdd.type = 'button';
            btnAdd.className = 'btn btn-primary btnAdd';
            addImg = document.createElement('img');
            addImg.src = 'webpage-image/icon-plus.svg';
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
            cardPrice.textContent = "RM " + item[Cart.PRICE].toString();
            cardDel = document.createElement('p');
            cardDel.className = 'card-text txtDel';
            cardDelSmall = document.createElement('small');
            cardDelSmall.textContent = "Remove from Cart";

            cardBody.appendChild(cardPrice);
            cardDel.appendChild(cardDelSmall);
            cardBody.appendChild(cardDel);
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
        const rmBtn = document.querySelectorAll('.btn.btn-primary.btnRm');
        const addBtn = document.querySelectorAll('.btnAdd');
        let numICDiv, parentDiv, availDiv;


        rmBtn.forEach(btn => {
            btn.addEventListener('click', () => {
                numICDiv = btn.nextElementSibling;
                if (parseInt(numICDiv.textContent) > 0)
                    numICDiv.textContent = parseInt(numICDiv.textContent) - 1;
            })
        })

        addBtn.forEach(btn => {
            console.log('hi');
            btn.addEventListener('click', () => {
                numICDiv = btn.previousElementSibling;
                parentDiv = btn.parentElement;
                availDiv = parentDiv.nextElementSibling;
                if (parseInt(numICDiv.textContent) < parseInt(availDiv.textContent))
                    numICDiv.textContent = parseInt(numICDiv.textContent) + 1;
            })
        })
    }

    
    function getCart() {
        // Get all details of every cart food item from database
        formData = new FormData();
        formData.append('func', 'getCart');
        formData.append('user_id', parseInt(localStorage.getItem('user_id')));
        // Call login.php script and take response from script, convert to json array, push all rows in json array to prevCartItem 2D array and catch error
        return fetch('cart.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => table.forEach(row => cartItem.push(row)))
            .catch(error => console.error('ERROR: ', error))
    }


    function inCart(item, prevCartItem) {
        let locIndex = -1;
        for (let row = 0; row < prevCartItem.length; row++) {
            if (parseInt(item.id) === prevCartItem[row][0])
                locIndex = row;
        }
        return locIndex;
    }


    function updateCart() {
        // Create json object to be passed to php (either to delete, update or insert to table)
        let deleteCartItem = [];
        let updateCartItem = {};
        // Get all .num-in-cart which contains number of items in cart 
        const foodList = document.querySelectorAll('.num-in-cart');

        // Checks through for changes to cart and carries out necessary changes ie. delete, update, insert
        foodList.forEach(item => {
            let itemIndex = inCart(item, cartItem);

            if (itemIndex >= 0) {
                if (parseInt(item.textContent) === 0)
                    deleteCartItem.push(parseInt(item.id));

                else if (parseInt(item.textContent) !== cartItem[itemIndex][Cart.NUM])
                    updateCartItem[parseInt(item.id)] = parseInt(item.textContent);
            }
        });

        console.log(deleteCartItem);
        console.log(updateCartItem);


        // Append cart data into FormData object to pass to php
        let locFormData = new FormData();

        locFormData.append('func', 'modifyCart');
        locFormData.append('user_id', localStorage.getItem('user_id').toString());
        locFormData.append('delete_cart_item', JSON.stringify(deleteCartItem));
        locFormData.append('update_cart_item', JSON.stringify(updateCartItem));

        // Call fetch API to pass data to menu.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('cart.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));
    }
});