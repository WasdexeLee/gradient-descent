document.addEventListener('DOMContentLoaded', function () {
    // Init array to store orders and the food items in each order
    let orders = [];
    let orderItems = [];


    updateTime(); // Update time immediately on load
    setInterval(updateTime, 1000); // Update the time every second


    getOrder()
        .then(() => dynamicLoadOrders());




    // Displays current local time to use as reference by kitchen staff
    function updateTime() {
        const now = new Date();
        const timeString = now.toLocaleTimeString(); // Gets local time in readable format
        document.getElementById('timeDisplay').textContent = timeString;
    }


    function getOrder() {
        // Get all details of every order
        formData = new FormData();
        formData.append('func', 'getOrder');
        // Call kitchen.php script to fetch all order and their associated food items
        return fetch('../php-script/kitchen.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(data => {
                orders = data['orders'];
                orderItems = data['orderItems'];
            })
            .catch(error => console.error('ERROR: ', error));
    }


    // Dynamically load all the order into order cards into the kitchen page
    function dynamicLoadOrders() {
        // Get main container which holds all order cards
        const orderItemContainer = document.getElementById('main-container');
        let col4 = 0;   //counter to determine whether the card is the fourth order card or not

        // Create initial row to store the order cards
        let currentRow = document.createElement('div');
        currentRow.className = 'row';
        orderItemContainer.appendChild(currentRow);

        // Loops through all orders and creates dynamic order cards to be inserted into the 
        orders.forEach(order => {
            // Check if there is 4 cards in the row, if true, create new row
            if (col4 > 4) {
                currentRow = document.createElement('div');
                currentRow.className = 'row';
                orderItemContainer.appendChild(currentRow);
                col4 = 0;
            }
            // Increment by 1 card everytime a card is created
            col4++;

            // Convert the date taken from database into js Date object
            let dateObj = new Date(order[2]);

            // Uses toLocaleTimeString method to convert to local timezone and convert to format needed
            let timeString = dateObj.toLocaleTimeString('en-US', {
                hour: '2-digit',
                minute: '2-digit',
                second: '2-digit'
            });

            // Use to hold the dynamic food item rows
            let foodItems = ``;

            // Loop through all food items in the order and add them to the dynamic row
            orderItems[order[0]].forEach(item => {
                foodItems += `
                    <tr>
                        <td>${item[2]}</td>
                        <td class="td-right">${item[1]}</td>
                    </tr>`;
            });

            // Create dynamic card and insert into the current row
            currentRow.innerHTML += `
                <div class="col-lg-3 container-col-div">
                    <div class="order-container">
                        <div class="order-header">
                            <div class="food-items">
                                <table>
                                    <tr>
                                        <td>Time Placed: </td>
                                        <td class="td-right">${timeString}</td>
                                    </tr>
                                    <tr>
                                        <td>Order ID:</td>
                                        <td class="td-right">${order[0]}</td>
                                    </tr>
                                    <tr>
                                        <td>Phone Number:</td>
                                        <td class="td-right">${order[1]}</td>
                                    </tr>
                                </table>
                            </div>
                        </div>

                        <hr> 

                        <div class="order-body">
                            <p>Request for this ORDER:</p>
                            <p>No onions, extra sauce</p>
                            <hr class="dotted">
                                <div class="food-items">
                                    <table>
                                        <tr>
                                            <th>Food Name</th>
                                            <th class="td-right">Quantity</th>
                                        </tr>
                                        ${foodItems}
                                    </table>
                                </div>
                        </div>

                        <button class="complete-btn" onclick="markCompleted(this)" id=${order[0]}>Complete</button>
                    </div>
                </div>`;
        });
    }


    function markCompleted(button) {
        button.classList.add('completed');
        button.textContent = 'Delete';



            // Update cuntdown timer
            let timerLength = 5;
            
            let intervalCounter = setInterval(function () {
                timerLength--;
                document.getElementById('countdownText').textContent = timerLength.toString();

                // If timer has gone down to 0, stop intervalCounter, hide modal and move to home page (or order pending page)
                if (timerLength <= 0) {
                    clearInterval(intervalCounter);
                    $('#orderPlacedModal').modal('hide');
                    window.location.href = "../html/home.html";
                }
            }, 1000);

            // Button to close the modal manually
            document.getElementById('OPCloseButton').addEventListener('click', function () {
                clearInterval(intervalCounter);
                $('#orderPlacedModal').modal('hide');
                window.location.href = "../html/home.html";
            });
    }
});
































