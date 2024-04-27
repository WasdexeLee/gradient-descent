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
    // Element cod-price in payment method
    let codPriceEl = document.getElementById('cod-price');
    // Element final-container-div
    let finalContainerDiv = document.querySelector('.final-container-div');
    // Element footer 
    let footer = document.getElementById('footer');
    // Element Total in footer 
    let footerTotalEl = document.getElementById('footer-total')




    getCart()
        .then(() => dynamicLoadItem())
        .then(() => adjustAddressTextareaHeight())
        .then(() => buttonListener())
        .then(() => updateTotalBreakdown())
        .then(() => updatePaymentMethod())
        .then(() => updateFooter());


    window.addEventListener('resize', updateMargin());




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
            img.className = 'img-fluid summary-img';
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


    function buttonListener() {
        // // Get cart icon to add event listener
        // const cartIcon = document.getElementById('navbar-cart');

        // cartIcon.addEventListener('click', () => {
        //     location.reload();
        // });


        // // Get cart icon to add event listener
        // const checkoutBtn = document.querySelector('.btn.btn-primary.btn-checkout');

        // checkoutBtn.addEventListener('click', () => {
        //     window.location.href = "../html/checkout.html";
        // });


        const autofillBtn = document.querySelector('.btn-autofill');

        autofillBtn.addEventListener('click', autofillCustInfo);
    }


    // Function to adjust textarea height
    function adjustAddressTextareaHeight() {
        addressTextarea.style.height = 'auto';  // Reset the height
        addressTextarea.style.height = addressTextarea.scrollHeight + 'px';  // Set height equal to scroll height
    }


    function autofillCustInfo() {
        // Element form 
        custInfoForm = document.getElementById('cust-info-form');
        // Array to store customer information
        locCustInfo = [];


        if (locCustInfo.length === 0) {
            //fetch the information of customer
            formData = new FormData();
            formData.append('func', 'getUserInfo');
            formData.append('user_id', localStorage.getItem('user_id'));

            fetch('../php-script/checkout.php', { method: 'POST', body: formData, })
                .then(phpResponse => phpResponse.json())
                .then(row => locCustInfo = row)
                .catch(error => console.error('ERROR: ', error))
                .then(() => locAutoFill());
        }
        else {
            locAutoFill();
        }


        function locAutoFill() {
            custInfoForm.name.value = locCustInfo[0];
            custInfoForm.phone.value = locCustInfo[1];
            custInfoForm.address.value = locCustInfo[2];
        }
    }


    function updateTotalBreakdown() {
        let subtotal = 0;
        let deliveryFee = 0;
        let totalAmount = 0;


        for (let price of priceArr)
            subtotal += parseFloat(price.textContent.slice(3));

        if (subtotal > 0)
            deliveryFee = 7;

        totalAmount = subtotal + deliveryFee;


        subtotalEl.textContent = "RM " + subtotal.toFixed(2).toString();
        deliveryFeeEl.textContent = "RM " + deliveryFee.toFixed(2).toString();
        totalAmountEl.textContent = "RM " + totalAmount.toFixed(2).toString();
    }


    function updatePaymentMethod() {
        var additionalRemark = document.getElementById('remark');
        var payementMethodTitleEl = document.getElementById('payment-title');
        var paymentMethodSelect = document.getElementById('payment-method');
        var creditMethod = document.getElementById('credit-method');
        var tngMethod = document.getElementById('tng-method');
        var codMethod = document.getElementById('cod-method');
        

        function scrollToBottom() {
            additionalRemark.scrollIntoView({ block: 'end' });

            const topPos = payementMethodTitleEl.getBoundingClientRect().top + window.scrollY;

            window.scroll({
                top: topPos,
                left: 0,
                behavior: 'smooth'
            });

            updateMargin();
        }


        function togglePaymentMethod(value) {
            if (value === "credit-card") {
                creditMethod.style.display = 'block';
                tngMethod.style.display = 'none';
                codMethod.style.display = 'none';
                scrollToBottom();

            } 
            else if (value === "tng-ewallet") {
                creditMethod.style.display = 'none';
                tngMethod.style.display = 'block';
                codMethod.style.display = 'none';
                scrollToBottom();

            }  
            else if (value === "cod") {
                creditMethod.style.display = 'none';
                tngMethod.style.display = 'none';
                codMethod.style.display = 'block';
                scrollToBottom();
            } 
        }

        // Initially hide all card fields
        togglePaymentMethod(paymentMethodSelect.value);

        // Add event listener
        paymentMethodSelect.addEventListener('change', function () {
            togglePaymentMethod(this.value);
        });
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

        // Total amount add on delivery fee
        totalAmount += parseFloat(deliveryFeeEl.textContent.slice(3));

        // Write to the footer's element
        footerTotalEl.textContent = "Items (" + item.toString() + ")  :  ";

        let footerTotalAmountEl = document.createElement('b');
        footerTotalAmountEl.className = 'footer-total-amount';
        footerTotalAmountEl.id = 'footer-total-amount';

        footerTotalEl.appendChild(footerTotalAmountEl);

        footerTotalAmountEl.textContent = "RM " + totalAmount.toFixed(2).toString();
        codPriceEl.textContent = "RM " + totalAmount.toFixed(2).toString();
    }


    function updateMargin() {
        locHeight = parseInt(window.getComputedStyle(footer).getPropertyValue('height'), 10);
        finalContainerDiv.style.marginBottom = (locHeight + 20).toString() + 'px';
    }


    function placeOrder() {

            // Create json object to be passed to php (either to delete, update or insert to table)
            let updateCartItem = {};
    
            // Checks through for changes to cart and carries out necessary changes ie. delete, update, insert
            numICDivArr.forEach(item => {
                // Find index of item in cart
                let itemIndex = itemId.indexOf(parseInt(item.id));
    
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
});