// Executed when webpage DOM finish loading
document.addEventListener('DOMContentLoaded', function () {
    // Init variable to store form, signuptext and alertbox 
    const signupForm = document.getElementById('signupForm');
    const loginText = document.getElementById('logIn');
    const alertUsernameBox = document.getElementById('alertUsername');
    const alertPasswordBox = document.getElementById('alertPassword');
    // Init array to store all username
    let existingUsername = [];




    // Event listener for when form is submitted
    signupForm.addEventListener('submit', function (event) {
        // Prevents default submission for the form 
        event.preventDefault();

        // Reset alert box when user re-enter detail
        alertUsernameBox.style.display = 'none';
        alertPasswordBox.style.display = 'none';

        // Init var to store the username and password entered by user
        const username = document.getElementById('username').value;
        const email = document.getElementById('email').value;
        const password = document.getElementById('password').value;
        const phone = document.getElementById('phone').value;
        const address = document.getElementById('address').value;
        const operator = document.querySelector('input[name="operator"]:checked').value.toUpperCase();
        const notification = (document.getElementById('notification').checked).toString().toUpperCase();
        const confirmPassword = document.getElementById('confirmPassword').value;


        // Check if username has been used
        fetchExistingUsername()
            .then(() => userSignupValidation(username, password, confirmPassword))
            .then(validationReturn => {
                if (validationReturn) {
                    // Insert user detail to database 
                    insertUser(username, email, password, phone, address, operator, notification);

                    // Print to console for validation
                    console.log("Sign-up successful. Redirecting to login page.");

                    // Redirect to the homepage
                    window.location.href = '/login.html';
                }
            });
    });




    // Event listener for when user clicks on login text
    loginText.addEventListener('click', function () {
        // Redirect to the sign-up page
        window.location.href = '/login.html';
    });




    function fetchExistingUsername() {
        // Gets username that exists every submit to prevent missing out when using back arrow of browser
        existingUsername.length = 0;    // Clear array 
        let formData = new FormData();
        formData.append('func', 'getUserName');
        // Call login.php script and take response from script, convert to json array, push row to array and catch eorror
        return fetch('signup.php', { method: 'POST', body: formData, })
            .then(phpResponse => phpResponse.json())
            .then(array => existingUsername = array)
            .then(function () { console.log(existingUsername) })  //to remove
            .catch(error => console.error('ERROR: ', error));
    }




    // Function to find if username has been used and if password is matching
    function userSignupValidation(input_username, input_password, input_confirmPassword) {
        // Finds index of username
        // Returns -1 if not found
        let locUserIndex = existingUsername.indexOf(input_username);

        // If -1(user does not exist), if password match, return true(username and password is valid)
        if (locUserIndex === -1) {
            if (input_password === input_confirmPassword)
                return Promise.resolve(true);
            else {
                alertPasswordBox.style.display = 'block';
                return Promise.resolve(false);
            }
        }
        else {
            alertUsernameBox.style.display = 'block';
            return Promise.resolve(false);
        }
    }




    // Function to insert new user record to database
    function insertUser(input_username, input_email, input_password, input_phone, input_address, input_operator, input_notification) {
        // Append signup data into FormData object to pass to php
        let locFormData = new FormData();
        locFormData.append('func', 'insertUser');
        locFormData.append('user_name', input_username);
        locFormData.append('user_email', input_email);
        locFormData.append('user_password', input_password);
        locFormData.append('user_phone', input_phone);
        locFormData.append('user_address', input_address);
        locFormData.append('user_operator', input_operator);
        locFormData.append('user_notification', input_notification);

        // Call fetch API to pass data to signup.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('signup.php', { method: 'POST', body: locFormData })
            .then(response => response.text())
            .then(responseText => console.log(responseText))
            .catch(error => console.error("ERROR: ", error));
    }
});