document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    fetch('../php-script/get_session_data.php')
        .then(response => response.json())
        .then(data => {
            if (!(data.loggedIn))
                window.location.href = '../html/login.html';
        });


    const editButton = document.getElementById('editButton');
    const logoutButton = document.getElementById('logoutButton');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    const profileForm = document.getElementById('profileForm');
    const addressTextarea = document.getElementById('address');


    //fetch and show the information of user
    formData = new FormData();
    formData.append('func', 'getUser');

    fetch('../php-script/profile.php', { method: 'POST', body: formData, })
        .then(phpResponse => phpResponse.json())
        .then(userInfo => {
            profileForm.username.value = userInfo[0];
            profileForm.email.value = userInfo[1];
            addressTextarea.value = userInfo[2];
            profileForm.phone.value = userInfo[3];
        })
        .then(() => adjustTextareaHeight());


    //the edit and submit function
    editButton.addEventListener('click', function () {
        if (validateForm(profileForm.email.value, profileForm.phone.value)) {
            if (editButton.innerText === "Edit") {
                //the edit button change to submit button
                inputs.forEach(input => {
                    input.classList.add('editable');
                    input.readOnly = false;
                });
                addressTextarea.readOnly = false;
                addressTextarea.disabled = false;
                addressTextarea.classList.add('editable');
                editButton.innerText = "Submit";
            } else {
                //modify the information
                formData = new FormData();
                formData.append('func', 'modifyUser');
                formData.append('user_name', profileForm.username.value);
                formData.append('user_email', profileForm.email.value);
                formData.append('user_address', addressTextarea.value);
                formData.append('user_phone', profileForm.phone.value);

                fetch('../php-script/profile.php', { method: 'POST', body: formData })
                    .then(response => response.text())
                    //tell the user that the data has been updated and remove the editable attribute
                    .then(() => {
                        alert('Profile updated successfully!');
                        inputs.forEach(input => {
                            input.classList.remove('editable');
                            input.readOnly = true;

                        });
                        addressTextarea.classList.remove('editable');
                        addressTextarea.readOnly = true;
                        addressTextarea.disabled = true;

                        editButton.innerText = "Edit";
                    })
                    .catch(error => console.error('Error:', error));
            }
        }
    });


    logoutButton.addEventListener('click', function () {
        // Select log out function
        formData = new FormData();
        formData.append('func', 'logOut');

        // Call log out function in php script
        fetch('../php-script/profile.php', { method: 'POST', body: formData })
            .then(response => response.text())
            .then(() => window.location.href = '../html/login.html');
    })


    function adjustTextareaHeight() {
        addressTextarea.style.height = 'auto';  // Reset the height
        addressTextarea.style.height = addressTextarea.scrollHeight + 'px';  // Set height equal to scroll height
    }


    function validateForm(email, phoneNumber) {
        // Validate Email
        const emailRegex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,6}$/;
        if (!emailRegex.test(email)) {
            alert("Invalid email address.");
            return false;
        }

        // Validate Phone Number
        const phoneRegex = /^(\+?0|\+?[1-9])([\d\s-]){1,14}$/;
        if (!phoneRegex.test(phoneNumber)) {
            alert("Invalid phone number.");
            return false;
        }

        return true;
    }
});