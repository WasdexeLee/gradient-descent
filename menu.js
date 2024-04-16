document.addEventListener('DOMContentLoaded', function () {
    // Init array to store all username
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


    // Activates when cart icon is clicked
    cartIcon.addEventListener('click', () => {
        // Create json object to be passed to php
        let cartItem = {};
        // Get all .num-in-cart which contains number of items in cart 
        const cartFoodList = document.querySelectorAll('.num-in-cart');

        // Checks through and appends to json if more than 1 added into cart
        cartFoodList.forEach(item => {
            if (item.textContent > 0)
                cartItem[item.id] = parseInt(item.textContent);
        });

        console.log(cartItem);
        

        // Append cart data into FormData object to pass to php
        let locFormData = new FormData();

        locFormData.append('func', 'insertCart');
        locFormData.append('cartItem', JSON.stringify(cartItem));

        console.log(locFormData['func']);
        console.log(locFormData['cartItem']);
        console.log(locFormData.func);
        // Call fetch API to pass data to menu.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('menu.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));



        // window.location.href = '/DI Assignment Code Files/CapybaraExpress/cart.html';
    })


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
        .then(() => dynamicLoadCard())
        .then(() => buttonListener());


    // Every change in webpage size, checks number of line of title and change description length to accomodate title
    window.addEventListener('resize', checkTitleLine);




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
            rmImg.src = 'food-image/icon-minus.svg';
            numICDiv =  document.createElement('div');
            numICDiv.id = item[Food.ID];
            numICDiv.className = 'num-in-cart';
            numICDiv.textContent = 0;
            btnAdd = document.createElement('button');
            btnAdd.type = 'button';
            btnAdd.className = 'btn btn-primary btnAdd';
            addImg = document.createElement('img');
            addImg.src = 'food-image/icon-plus.svg';
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




    function buttonListener(){
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
                btn.addEventListener('click', () => {
                    numICDiv = btn.previousElementSibling;
                    parentDiv = btn.parentElement;
                    availDiv = parentDiv.nextElementSibling;
                    if (parseInt(numICDiv.textContent) < parseInt(availDiv.textContent))
                        numICDiv.textContent = parseInt(numICDiv.textContent) + 1;
                })
        })




    }
});