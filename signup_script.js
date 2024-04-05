document.addEventListener('DOMContentLoaded', function () {
    // Init variable to store form, signuptext and alertbox 
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');
    // Init array to store all user detail
    let userDetail;


    // Call login.php script and take response from script, convert to json array, push all rows in json array to userDetail 2D array, log to console when done and catch eorror
    fetch('signup.php')
    .then(phpResponse => phpResponse.json())
    .then(table => userDetail = table)
    .then(function(){console.log(userDetail)})
    .catch(error => console.error('Errrooooorrrr: ', error));


    // Event listener for when form is submitted
    loginForm.addEventListener('submit', function (event) {
        // Prevents default submission for the form 
        event.preventDefault();
        // Init var to store the username and password entered by user
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
   
        // Check if username has been used
        if (usernameUnuseValidation(username)) {
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

    
    // Function to find if username has been used
    function usernameUnuseValidation(input_username, input_password){
        // Finds index of username
        // Returns -1 if not found
        let locUserIndex = userDetail.indexOf(input_username);

        // If -1(user does not exist) return true(username is unused)
        if (locUserIndex === -1)
            return true;
        else 
            return false;
    }


    // Function to insert new user record to database
    function insertUser(input_username, input_password){

    }


    
});