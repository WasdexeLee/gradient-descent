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




    // Function to dynamically load card of cart item into webpage
    function dynamicLoadCard() {
        const foodItemContainer = document.getElementById('food-item-col');
        let currentRow;
        let col12, card, innerRow, col3, foodImg, col9, cardBody, cardTitle, btnRm, rmImg, numICDiv, btnAdd, addImg, btnAvailDiv, btnDiv, avail, cardDel, cardDelSmall, cardPrice;
        foodDetail.forEach(item => {
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
            foodImg.src = item[Food.IMAGE];

            innerRow.appendChild(col3);
            col3.appendChild(foodImg);


            col9 = document.createElement('div');
            col9.className = 'col-md-9';
            cardBody = document.createElement('div');
            cardBody.className = 'card-body';
            cardTitle = document.createElement('h5');
            cardTitle.className = 'card-title';
            cardTitle.textContent = item[Food.NAME];

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
            rmImg.src = 'food-image/icon-minus.svg';
            numICDiv = document.createElement('div');
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


            cardPrice = document.createElement('p');
            cardPrice.className = 'card-text price';
            item[Food.PRICE] = item[Food.PRICE].toFixed(2);
            cardPrice.textContent = "RM " + item[Food.PRICE].toString();
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
});