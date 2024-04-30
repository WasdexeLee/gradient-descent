document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    fetch('../php-script/get_session_data.php')
        .then(response => response.json())
        .then(data => {
            if (!(data.loggedIn))
                window.location.href = '../html/login.html';
        });


    // Init enum to make code more readable
    const Cart = Object.freeze({
        ID: 0,
        NUM: 1,
        NAME: 2,
        PRICE: 3,
        AVAILABILITY: 4,
        IMAGE: 5,
        SOLD: 6
    })
    // Variable to store cart items
    let cartItem = [];
    // Element address textarea
    var addressTextarea = document.getElementById('address');
    // Array to store all numincart and price
    let numICDivArr, priceArr;
    // Element form 
    let custInfoForm = document.getElementById('cust-info-form');
    // Element subtotal, deliveryFee, totalAmount
    let subtotalEl = document.getElementById('subtotal');
    let deliveryFeeEl = document.getElementById('delivery-fee');
    let totalAmountEl = document.getElementById('total-amount');
    // Element for payment method selection
    let paymentMethodSelect = document.getElementById('payment-method');
    // Element cod-price in payment method
    let codPriceEl = document.getElementById('cod-price');
    // Element additional remark for kitchen and delivery driver
    let kitchenRemark = document.getElementById('kitchenRemark');
    let deliveryRemark = document.getElementById('deliveryRemark');
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
        // Call login.php script and take response from script, convert to json array, push all rows in json array to prevCartItem 2D array and catch error
        return fetch('../php-script/checkout.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => table.forEach(row => cartItem.push(row)))
            .catch(error => console.error('ERROR: ', error));
    }


    function buttonListener() {
        const placeOrderBtn = document.querySelector('.btn.btn-primary.btn-place-order');

        placeOrderBtn.addEventListener('click', function () {
            placeOrder();

        });
        const autofillBtn = document.querySelector('.btn-autofill');

        autofillBtn.addEventListener('click', autofillCustInfo);
    }


    // Function to adjust textarea height
    function adjustAddressTextareaHeight() {
        addressTextarea.style.height = 'auto';  // Reset the height
        addressTextarea.style.height = addressTextarea.scrollHeight + 'px';  // Set height equal to scroll height
    }


    function autofillCustInfo() {
        // Array to store customer information
        locCustInfo = [];


        if (locCustInfo.length === 0) {
            //fetch the information of customer
            formData = new FormData();
            formData.append('func', 'getUserInfo');

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
        let payementMethodTitleEl = document.getElementById('payment-title');
        let creditMethod = document.getElementById('credit-method');
        let tngMethod = document.getElementById('tng-method');
        let codMethod = document.getElementById('cod-method');


        function scrollToBottom() {
            kitchenRemark.scrollIntoView({ block: 'end' });

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
        // Get all order detail 
        let orderCustName = custInfoForm.name.value;
        let orderCustPhone = custInfoForm.phone.value;
        let orderCustAddress = custInfoForm.address.value;
        let orderPaymentMethod = paymentMethodSelect.value;
        let orderKitchenInstruction = kitchenRemark.value;
        let orderDeliveryInstruction = deliveryRemark.value;


        // Check if payment detail is not empty
        if ((orderCustName.length === 0) || (orderCustPhone.length === 0) || (orderCustAddress.length === 0) || (orderPaymentMethod.length === 0))
            $('#alertModal').modal('show'); // Show Bootstrap modal
        else {
            if (validateUserDetails(orderCustPhone)) {
                // Check if using credit card as payment 
                // If true, check for empty
                if (orderPaymentMethod === 'credit-card') {
                    let paymentMethodForm = document.getElementById('payment-method-form');
                    let cardName = paymentMethodForm.cardholderName.value;
                    let cardNumber = paymentMethodForm.cardNumber.value;
                    let expiryDate = paymentMethodForm.expiryDate.value;
                    let cvv = paymentMethodForm.cvv.value

                    // Then run insert order function
                    if ((cardName.length === 0) || (cardNumber.length === 0) || (expiryDate.length === 0) || (cvv.length === 0))
                        $('#alertModal').modal('show'); // Show Bootstrap modal
                    else {
                        if (validateCardDetails(cardNumber, expiryDate, cvv))
                            insertOrder();
                    }
                }
                // Run insert order function
                else
                    insertOrder();
            }
        }


        // Function to insert order details into database
        function insertOrder() {
            // Append cart data into FormData object to pass to php
            let locFormData = new FormData();

            // Append necessary info for php
            locFormData.append('func', 'insertOrder');
            locFormData.append('order_cust_name', orderCustName);
            locFormData.append('order_cust_phone', orderCustPhone);
            locFormData.append('order_cust_address', orderCustAddress);
            locFormData.append('order_payment_method', orderPaymentMethod);
            locFormData.append('order_kitchen_instruction', orderKitchenInstruction);
            locFormData.append('order_delivery_instruction', orderDeliveryInstruction);
            locFormData.append('order_item', JSON.stringify(cartItem));


            // Call fetch API to pass data to checkout.php
            // Use POST method, passes locFormData, wait for response and log to console
            fetch('../php-script/checkout.php', { method: 'POST', body: locFormData })
                .then(response => response.text())
                .then(responseText => console.log(responseText))
                .catch(error => console.error("ERROR: ", error))
                .then(() => triggerOPModal());
        }


        // Function to trigger order placed modal
        function triggerOPModal() {
            // Trigger to show modal
            $('#orderPlacedModal').modal('show');

            // Update countdown timer
            let timerLength = 5;

            let intervalCounter = setInterval(function () {
                timerLength--;
                document.getElementById('countdownText').textContent = timerLength.toString();

                // If timer has gone down to 0, stop intervalCounter, hide modal and move to index page (or order pending page)
                if (timerLength <= 0) {
                    clearInterval(intervalCounter);
                    $('#orderPlacedModal').modal('hide');
                    window.location.href = "../html/index.html";
                }
            }, 1000);

            // Button to close the modal manually
            document.getElementById('OPCloseButton').addEventListener('click', function () {
                clearInterval(intervalCounter);
                $('#orderPlacedModal').modal('hide');
                window.location.href = "../html/index.html";
            });
        }


        function validateUserDetails(phoneNumber) {
            // Validate phone number
            const phoneRegex = /^(\+?0|\+?[1-9])([\d\s-]){1,14}$/;
            if (!phoneRegex.test(phoneNumber)) {
                alert("Invalid phone number.");
                return false;
            }
            return true;
        }


        function validateCardDetails(cardNumber, expiryDate, cvv) {
            // Validate bank card number assuming is visa, master, american express card
            const cardNumberRegex = /^(?:4[0-9]{3}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{1,4}|5[1-5][0-9]{2}\s?[0-9]{4}\s?[0-9]{4}\s?[0-9]{4}|3[47][0-9]{2}\s?[0-9]{6}\s?[0-9]{5})$/;
            if (!cardNumberRegex.test(cardNumber)) {
                alert("Invalid card number.");
                return false;
            }

            // Validate card expiry date (MM/YY)
            const expiryDateRegex = /^(0[1-9]|1[0-2])\/?([0-9]{2})$/;
            if (!expiryDateRegex.test(expiryDate)) {
                alert("Invalid expiry date. Format should be MM/YY.");
                return false;
            }

            // Validate CVV
            const cvvRegex = /^[0-9]{3,4}$/;
            if (!cvvRegex.test(cvv)) {
                alert("Invalid CVV.");
                return false;
            }
            return true;
        }
    }
});





















