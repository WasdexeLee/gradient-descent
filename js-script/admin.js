document.addEventListener('DOMContentLoaded', function () {
   // Forces user to login 
   fetch('../php-script/get_session_data.php')
   .then(response => response.json())
   .then(data => {
       if (!(data.loggedIn))
           window.location.href = '../html/login.html';
   });


    let foodItem = [];

    // Init enum to make code more readable
    const Food = Object.freeze({
        ID: 0,
        NAME: 1,
        CATEGORY_ID: 2,
        CATEGORY_NAME: 3,
        DESCRIPTION: 4,
        PRICE: 5,
        AVAILABILITY: 6,
        IMAGE: 7,
        PREP_TIME: 8,
        NUM_SOLD: 9
    })



    getFoodItem()
        .then(() => console.log(foodItem))
        .then(() => dynamicLoadItem())
        .then(() => addButtonListener())
        .then(() => adjustAddressTextareaHeight());




    // Calls admin.php to fetch all food items in database for admin to edit or delete 
    function getFoodItem() {
        // Get all details of every food item from database
        let formData = new FormData();
        formData.append('func', 'getFoodItem');
        // Call admin.php script and take response from script, convert to json array, push all rows in json array to foodDetail 2D array and catch error
        return fetch('../php-script/admin.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(table => foodItem = table)
            .catch(error => console.error('ERROR: ', error));
    }


    function dynamicLoadItem() {
        // Get element which contains all food item displayed
        const container = document.getElementById('foodItemsContainer');
        foodItem.forEach(item => {
            container.innerHTML += `
                    <div class='food-container'>
                        <table>
                            <tr>
                                <td colspan="2"><img src='${item[Food.IMAGE]}' alt='Food Image' style="width:100px; height:auto;" id="${item[Food.ID]}"></td>
                            </tr>
                            <tr>
                                <th>Name:</th>
                                <td><textarea class='food_name' rows='1' id="${item[Food.ID]}" readonly>${item[Food.NAME]}</textarea></td>
                            </tr>
                            <tr>
                                <th>Category:</th>
                                <td>
                                    <select class='food_category_name' id="${item[Food.ID]}" disabled>
                                        <option value="1">Fried</option>
                                        <option value="2">Chicken</option>
                                        <option value="3">Noodle</option>
                                        <option value="4">Drinks</option>
                                        <option value="5">Dessert</option>
                                    </select>
                                </td>
                            </tr>
                            <tr>
                                <th>Description:</th>
                                <td><textarea class='food_description' rows='1' id=${item[Food.ID]} readonly>${item[Food.DESCRIPTION]}</textarea></td>
                            </tr >
                            <tr>
                                <th>Price:</th>
                                <td><textarea class='food_price' rows='1' id=${item[Food.ID]} readonly>${item[Food.PRICE]}</textarea></td>
                            </tr>
                            <tr>
                                <th>Availability:</th>
                                <td><textarea class='food_availability' rows='1' id=${item[Food.ID]} readonly>${item[Food.AVAILABILITY]} available</textarea></td>
                            </tr>
                            <tr>
                                <th>Prepare Time:</th>
                                <td><textarea class='food_prep_time' rows='1' id=${item[Food.ID]} readonly>${item[Food.PREP_TIME]} mins</textarea></td>
                            </tr>
                            <tr>
                                <th>Number Sold:</th>
                                <td><textarea class='food_num_sold' rows='1' id=${item[Food.ID]} readonly>${item[Food.NUM_SOLD]}</textarea></td>
                            </tr>
                            <tr class="buttonrow"><th></th>
                                <td class="buttondata">
                                    <div class="buttons">
                                    <button type="button" class='editBtn' id="${item[Food.ID]}">Edit</button>
                                    <button type="button" class='deleteBtn' id="${item[Food.ID]}">Delete</button>
                                    </div>
                                </td>
                            </tr>
                        </table> 
                    </div>
                `;
        });

        foodItem.forEach(item => {
            select = document.querySelector(`select[id='${item[Food.ID]}']`);
            select.value = item[Food.CATEGORY_ID].toString();
        })
    }


    // Add event listener to all buttons
    function addButtonListener() {
        // Get all edit button element
        let editButtonList = document.querySelectorAll('.editBtn');
        let deleteButtonList = document.querySelectorAll('.deleteBtn');
        console.log(editButtonList);

        // Loop through all buttons and add eventlistener
        editButtonList.forEach(editButton => {

            // For all edit button
            editButton.addEventListener('click', function () {
                // Get all textarea tied to the button
                let textAreaList = document.querySelectorAll(`textarea[id="${this.id}"]`);
                let select = document.querySelector(`select[id='${this.id}']`);
                let imgParent = document.querySelector(`img[id='${this.id}']`).parentElement;
                console.log(this);

                // If the inner text of the button is edit, then change to submit 
                // Else submit to database and change text to edit
                if (this.innerText === "Edit") {
                    // Loops through all textarea
                    textAreaList.forEach(textArea => {
                        // Adds class of editable to change style of textarea
                        // Make textarea no longer readonly
                        // Add eventlistener so that the textarea would dynamically change height when being inputted
                        textArea.classList.add('editable');
                        textArea.readOnly = false;
                    });

                    // Add editable class to select element
                    select.classList.add('editable');
                    select.disabled = false;

                    // Create input to take in the photo
                    fileInput = document.createElement('input');
                    fileInput.setAttribute('type', 'file');
                    fileInput.setAttribute('id', 'file-input');

                    // Append the input into the card
                    imgParent.appendChild(fileInput);

                    // Changes edit button to submit button
                    this.innerText = "Submit";
                }
                else {
                    // Append all data needed to update the food item 
                    let formData = new FormData();

                    formData.append('func', 'modifyFoodItem');
                    formData.append('food_id', parseInt(this.id));
                    formData.append('food_name', findElement('food_name', textAreaList).value);
                    formData.append('food_category_id', select.value);
                    formData.append('food_description', findElement('food_description', textAreaList).value);
                    formData.append('food_price', parseFloat(findElement('food_price', textAreaList).value));
                    formData.append('food_availability', parseInt(findElement('food_availability', textAreaList).value));
                    formData.append('food_prep_time', parseInt(findElement('food_prep_time', textAreaList).value));
                    formData.append('food_num_sold', parseInt(findElement('food_num_sold', textAreaList).value));

             
                    // Call fetch API to pass data to admin.php
                    // Use POST method, passes formData, wait for response and log to console
                    fetch('../php-script/admin.php', { method: 'POST', body: formData })
                        .then(response => response.text())
                        .then(responseText => console.log(responseText))
                        .catch(error => console.error("ERROR: ", error));


                    // Loops through all textarea
                    textAreaList.forEach(textArea => {
                        // Reverses the previous settings
                        textArea.classList.remove('editable');
                        textArea.readOnly = true;
                    });

                    // Remove editable class to select element
                    select.classList.remove('editable');
                    select.disabled = true;

                    // Push to php and remove the input element 
                    inputEl = document.querySelector(`img[id='${this.id}']`).nextElementSibling;
                    const file = inputEl.files[0];
                    fileUpload(file);
                    imgParent.removeChild(inputEl);

                    // Changes submit button to edit button
                    editButton.innerText = "Edit";
                }
            });
        });


        deleteButtonList.forEach(deleteButton => {
            // For all delete button
            deleteButton.addEventListener('click', function () {
                // Init formData to prompt php to delete a particular food item 
                let formData = new FormData();

                formData.append('func', 'deleteFoodItem');
                formData.append('food_id', parseInt(this.id));


                // Call fetch API to pass data to admin.php
                // Use POST method, passes formData, wait for response and log to console
                fetch('../php-script/admin.php', { method: 'POST', body: formData })
                    .then(response => response.text())
                    .then(responseText => console.log(responseText))
                    .catch(error => console.error("ERROR: ", error))
                    .then(() => location.reload());
            })
        });


        function fileUpload(file) {
            // Check if file exists
            if (file) {
                // Create a FormData object
                const formData = new FormData();
                formData.append('func', 'fileUpload')
                formData.append('file_to_upload', file);

                // Send the FormData object to the PHP server using fetch
                fetch('../php-script/admin.php', { method: 'POST', body: formData })
                    .then(response => response.text())
                    .then(data => console.log(data))
                    .catch(error => console.error('Error:', error))
            }
            else {
                // If file does not exists, show error
                console.error('No file selected.');
            }
        }
    }


    function findElement(className, textAreaList) {
        // Loops through all element of textAreaList
        for (let textArea of textAreaList) {
            // Check to see if the textArea has the class name passed as parameter
            if (textArea.classList.contains(className)) {
                return textArea;
            }
        }
    }


    // Function to adjust textarea height
    function adjustAddressTextareaHeight() {
        // Get all textarea elements
        let textAreaList = document.querySelectorAll("textarea");

        // Loop through all textarea elements and add event listener to them to adjust their heights
        textAreaList.forEach(textArea => {
            adjustHeight(textArea);
            textArea.addEventListener('input', function () { adjustHeight(textArea); });
        });


        // Function to get things working
        function adjustHeight(tArea) {
            // Enable textarea height to be auto updated
            tArea.style.height = 'auto';  // Reset the height
            tArea.style.height = tArea.scrollHeight + 'px';  // Set height equal to scroll height
        }
    }
});