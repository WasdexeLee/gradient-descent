document.addEventListener('DOMContentLoaded', function () {
    let foodItem = [];

    // Init enum to make code more readable
    const Food = Object.freeze({
        ID: 0,
        NAME: 1,
        CATEGORY_NAME: 2,
        DESCRIPTION: 3,
        PRICE: 4,
        AVAILABILITY: 5,
        IMAGE: 6,
        PREP_TIME: 7,
        NUM_SOLD: 8
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
                                <td colspan="2"><img src='${item[Food.IMAGE]}' alt='Food Image' style="width:100px; height:auto;"></td>
                            </tr>
                            <tr>
                                <th>Name:</th>
                                <td><textarea class='food_name' rows='1' id=${item[Food.ID]} readonly>${item[Food.NAME]}</textarea></td>
                            </tr>
                            <tr>
                                <th>Category:</th>
                                <td><textarea class='food_category_name' rows='1' id=${item[Food.ID]} readonly>${item[Food.CATEGORY_NAME]}</textarea></td>
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
                            <tr>
                                <td class="buttons">
                                    <button type="button" class='editBtn' id="${item[Food.ID]}">Edit</button>
                                    <button type="button" class='deleteBtn' id="${item[Food.ID]}">Delete</button>
                                </td>
                            </tr>
                        </table> 
                    </div>
                `;
        });
    }



    // Add event listener to all buttons
    function addButtonListener() {
        // Get all edit button element
        let editButtonList = document.querySelectorAll('.editBtn');
        console.log(editButtonList);

        // Loop through all buttons and add eventlistener
        editButtonList.forEach(editButton => {

            // For all edit button
            editButton.addEventListener('click', function () {
                // Get all textarea tied to the button
                let textAreaList = document.querySelectorAll(`textarea[id="${this.id}"]`);
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

                    // Changes edit button to submit button
                    this.innerText = "Submit";
                } 
                else {
                    formData = new FormData();
                    formData.append('func', 'modifyFoodItem');
                    formData.append('food_id', this.id);
                    formData.append('food_name', findElement('food_name', textAreaList));
                    formData.append('food_category_name', findElement('food_category_name', textAreaList));
                    formData.append('food_description', findElement('food_description', textAreaList));
                    formData.append('food_price', findElement('food_price', textAreaList));
                    formData.append('food_availability', findElement('food_availability', textAreaList));
                    formData.append('food_prep_time', findElement('food_prep_time', textAreaList));
                    formData.append('food_num_sold', findElement('food_num_sold', textAreaList));




                    // Loops through all textarea
                    textAreaList.forEach(textArea => {
                        // Reverses the previous settings
                        textArea.classList.remove('editable');
                        textArea.readOnly = true;
                    });

                    // Changes submit button to edit button
                    editButton.innerText = "Edit";
                }



                // let textAreaList = document.querySelectorAll(`.${ editButton.id } `);
                // console.log(`.${ editButton.id } `);
                // console.log(textAreaList);
                // textAreaList.forEach(textArea => {
                //     textArea.classList.add('editable');
                //     textArea.readOnly = false;
                //     textArea.addEventListener('input', adjustAddressTextareaHeight);  
                //     console.log('asdf');
                // });


            });
        });




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
            textArea.addEventListener('input', function() {adjustHeight(textArea);});
        });


        // Function to get things working
        function adjustHeight(tArea) {
            // Enable textarea height to be auto updated
            tArea.style.height = 'auto';  // Reset the height
            tArea.style.height = tArea.scrollHeight + 'px';  // Set height equal to scroll height
        }
    }







});
