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
    // Element address textarea
    var addressTextarea = document.getElementById('address');
    // Array to store all numincart and price
    let numICDivArr, priceArr;
    // Element subtotal, deliveryFee, totalAmount
    let subtotalEl = document.getElementById('subtotal');
    let deliveryFeeEl = document.getElementById('delivery-fee');
    let totalAmountEl = document.getElementById('total-amount');
    // Element Total in footer 
    let footerTotalEl = document.getElementById('footer-total')




    getCart()
        .then(() => dynamicLoadItem())
        .then(() => updateTotalBreakdown())
        .then(() => updateFooter());




    // Function to dynamically load card of cart item into webpage
    function dynamicLoadItem() {
        const orderItemContainer = document.getElementById('order-item-col');
        let itemRow, imgDiv, img, bodyDiv, title, numICDiv, priceDiv, price;
        cartItem.forEach(item => {

            itemRow = document.createElement('div');
            itemRow.className = 'row no-gutters items-div';
            orderItemContainer.appendChild(itemRow);

            imgDiv = document.createElement('div');
            imgDiv.className = 'col-md-2 img-col-div';
            img = document.createElement('img');
            img.className = 'img-fluid';
            img.src = item[Cart.IMAGE];
            imgDiv.appendChild(img);
            itemRow.appendChild(imgDiv);

            bodyDiv = document.createElement('div');
            bodyDiv.className = 'col-md-8 item-body-col-div';
            title = document.createElement('h5');
            title.textContent = item[Cart.NAME];
            numICDiv = document.createElement('div');
            numICDiv.className = 'num-in-cart';
            numICDiv.id = parseInt(item[Cart.ID]);
            numICDiv.textContent = "x" + item[Cart.NUM].toString();
            bodyDiv.appendChild(title);
            bodyDiv.appendChild(numICDiv);
            itemRow.appendChild(bodyDiv);

            priceDiv = document.createElement('div');
            priceDiv.className = 'col-md-2 price-col-div text-right';
            price = document.createElement('p');
            price.className = 'price';
            price.textContent = "RM " + (item[Cart.PRICE] * item[Cart.NUM]).toFixed(2).toString();
            priceDiv.appendChild(price);
            itemRow.appendChild(priceDiv);
        })

        numICDivArr = document.querySelectorAll('.num-in-cart');
        priceArr = document.querySelectorAll('.price');

        // Event listener for input in textarea
        addressTextarea.addEventListener('input', adjustAddressTextareaHeight);
        adjustAddressTextareaHeight();
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


    // Function to adjust textarea height
    function adjustAddressTextareaHeight() {
        addressTextarea.style.height = 'auto';  // Reset the height
        addressTextarea.style.height = addressTextarea.scrollHeight + 'px';  // Set height equal to scroll height
    }


    function updateTotalBreakdown() {
        let subtotal = 0;
        let deliveryFee = 7;
        let totalAmount = 0;


        for (let price of priceArr)
            subtotal += parseFloat(price.textContent.slice(3));

        totalAmount = subtotal + deliveryFee;


        subtotalEl.textContent = "RM " + subtotal.toFixed(2).toString();
        deliveryFeeEl.textContent = "RM " + deliveryFee.toFixed(2).toString();
        totalAmountEl.textContent = "RM " + totalAmount.toFixed(2).toString();
    }


    function updateFooter() {
        // Init item and totalAmount to 0 and sum on later
        let item = 0;
        let totalAmount = 0;

        // Loop through all numICDiv and price to obtain each item's item and price and sum it up
        for (let numICDiv of numICDivArr)
            item += parseInt(numICDiv.textContent.slice(1));

        for (let price of priceArr)
            totalAmount += parseFloat(price.textContent.slice(3));

        // Write to the footer's element
        footerTotalEl.textContent = "Items (" + item.toString() + ") : ";

        let footerTotalAmountEl = document.createElement('b');
        footerTotalAmountEl.className = 'footer-total-amount';
        footerTotalAmountEl.id = 'footer-total-amount';
        footerTotalEl.appendChild(footerTotalAmountEl);

        footerTotalAmountEl.textContent = "RM " + totalAmount.toFixed(2).toString();
    }
});