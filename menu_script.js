document.addEventListener('DOMContentLoaded', function () {
    // Init variable to store form, signuptext and alertbox 
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');
    // Init array to store all username
    let existingUsername;


    let formData = new FormData();
    formData.append('func', 'getUserName');
    // Call login.php script and take response from script, convert to json array, push all rows in json array to userDetail 2D array, log to console when done and catch eorror
    fetch('signup.php', {method: 'POST', body: formData, })
    .then(phpResponse => phpResponse.json())
    .then(array => existingUsername = array)
    .then(function(){console.log(existingUsername)})  //to remove
    .catch(error => console.error('ERROR: ', error));


    // Event listener for when form is submitted
    loginForm.addEventListener('submit', function (event) {
        // Prevents default submission for the form 
        event.preventDefault();
        // Init var to store the username and password entered by user
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // const password_confirmation = document.getElementById('password_confirmation').value;
   
        // Check if username has been used
        // if (userSignupValidation(username, password, password_confirmation)) {
        if (userSignupValidation(username, password)) {
            insertUser(username, password);
            // Redirect to the homepage
            window.location.href = '/homepage.html';
        } 
        else {
            // Display error message
            alertBox.style.display = 'block';
        }
    });


    // Event listener for when user clicks on signup text
    signUpText.addEventListener('click', function () {
        // Redirect to the sign-up page
        window.location.href = '/signup.html';
    });

    
    // Function to find if username has been used and if password is matching
    // function userSignupValidation(input_username, input_password, input_password_confirmation){
    function userSignupValidation(input_username, input_password){
        // Finds index of username
        // Returns -1 if not found
        let locUserIndex = existingUsername.indexOf(input_username);

        // If -1(user does not exist) return true(username is unused)
        if (locUserIndex === -1){
            // if (input_password === input_password_confirmation)
                return true;
        }
        else 
            return false;
    }


    // Function to insert new user record to database
    // function insertUser(input_username, input_password, input_email, input_address, input_notification, input_operator){
    function insertUser(input_username, input_password){
        // Append signup data into FormData object to pass to php
        let locFormData = new FormData();
        locFormData.append('func', 'insertUser');
        locFormData.append('user_name', input_username);
        locFormData.append('user_password', input_password);
        // locFormData.append('user_email', input_email);
        // locFormData.append('user_address', input_address);
        // locFormData.append('user_notification', input_notification);   //change boolean to string
        // locFormData.append('user_operator', input_operator);    //same

        // Call fetch API to pass data to signup.php
        // Use POST method, passes locFormData, wait for response and log to console
        fetch('signup.php', {method: 'POST', body: locFormData})
        .then(response => response.text())
        .then(responseText => console.log(responseText))
        .catch(error => console.error("ERROR: ", error));
    }


    
});