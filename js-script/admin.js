document.addEventListener('DOMContentLoaded', function () {







    fetch('../php-script/admin.php')
        .then(response => response.json())
        .then(data => {
            const container = document.getElementById('foodItemsContainer');
            if (data.error) {
                container.innerHTML = `<p>Error fetching data: ${data.error}</p>`;
            } else {
                data.forEach(item => {
                    container.innerHTML += `
                    <div class='food-container'>
                        <table>
                            <tr>
                                <td colspan="2"><img src='${item.food_image}' alt='Food Image' style="width:100px; height:auto;"></td>
                            </tr>
                            <tr>
                                <th>Name:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1' id='d' readonly>${item.food_name}</textarea></td>
                            </tr>
                            <tr>
                                <th>Category:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1' readonly>${item.food_category_name}</textarea></td>
                            </tr>
                            <tr>
                                <th>Description:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1' readonly>${item.food_description}</textarea></td>
                            </tr>
                            <tr>
                                <th>Price:</th>
                                <td><textarea class='he'${item.food_name.replace(/[\s()]+/g, '')} rows='1' readonly>${item.food_price}</textarea></td>
                            </tr>
                            <tr>
                                <th>Availability:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1' readonly>${item.food_availability} available</textarea></td>
                            </tr>
                            <tr>
                                <th>Prepare Time:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1'readonly>${item.food_prep_time} mins</textarea></td>
                            </tr>
                            <tr>
                                <th>Number Sold:</th>
                                <td><textarea class='he ${item.food_name.replace(/[\s()]+/g, '')}' rows='1' readonly>${item.food_num_sold}</textarea></td>
                                <td class = "buttons"><button type="button" class='edit' id="${item.food_name.replace(/[\s()]+/g, '')}${item.food_id}">Edit</button>
                                <button type="button" class='delete' id="${item.food_name.replace(/[\s()]+/g, '')}${item.food_id}">Delete</button></td>
                            </tr>
                        </table>
                    </div>
                    `;
                });
            }
        })
        .catch(error => console.error('Error:', error))
        .then(() => adjustAddressTextareaHeight());
 

            // Function to adjust textarea height
    function adjustAddressTextareaHeight() {
        let textarealist = document.querySelectorAll(".he");
        textarealist.forEach(ta => {
            // ta.addEventListener('input', adjustAddressTextareaHeight);  

            ta.style.height = 'auto';  // Reset the height
            ta.style.height = ta.scrollHeight + 'px';  // Set height equal to scroll height

        }
        
        )
       
        let editButtonList = document.querySelectorAll('.edit');
        editButtonList.forEach(editButton => {
      
            editButton.addEventListener('click', function () {
                let textAreaList = document.querySelectorAll(`.${editButton.id.replace(/\d+/g, '')}`);
                if (editButton.innerText === "Edit") {
                    //the eidt button change to submit button

                    textAreaList.forEach(textArea => {
                        textArea.classList.add('editable');
                        textArea.readOnly = false;
                        textArea.addEventListener('input', adjustAddressTextareaHeight);  
           
                    });
                    editButton.innerText = "Submit";
                } else {
                    formData = new FormData();
                    formData.append('func','modifyFoodItem');
                    formData.append('food_id', (editButton.id.match(/\d+/))[0]);
                    formData.append('food_name', editButton.id.replace(/\d+/g, ''));
                    // formData.append('food_descript', tex)
                    formData.append('','');
                    formData.append('','');
                    formData.append('','');
                    formData.append('','');
                    formData.append('','');

                    console.log(textAreaList.getElementById('d').value);


                    textAreaList.forEach(textArea => {
                        textArea.classList.remove('editable');
                        textArea.readOnly = true;
                    });

                    editButton.innerText = "Edit";
                }



                // let textAreaList = document.querySelectorAll(`.${editButton.id}`);
                // console.log(`.${editButton.id}`);
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



 



});
