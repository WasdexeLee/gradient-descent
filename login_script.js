document.addEventListener('DOMContentLoaded', function () {
    // Init variable to store form, signuptext and alertbox 
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');
    // Init array to store all user detail
    let userDetail = [];
    // Init enum to make code more readable
    const User = Object.freeze({
        NAME: 0,
        PASSWORD: 1,
        IDENTITY: 2
    })


    // Call login.php script and take response from script, convert to json array, push all rows in json array to userDetail 2D array and catch error
    fetch('login.php')
    .then(response => response.json())
    .then(table => table.forEach(row => userDetail.push(row)))
    .catch(error => console.error('ERROR: ', error));


    // Event listener for when form is submitted
    loginForm.addEventListener('submit', function (event) {
        // Prevents default submission for the form 
        event.preventDefault();
        // Init var to store the username and password entered by user
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
        // Init var to store return from check function
        // -1 : user does not exists or wrong password
        // > -1 : userIndex
        const userIndex = userLoginValidation(username, password);
    
        // Check if password matches for the username
        if (userIndex > -1) {
            localStorage.setItem('user_id', userIndex);

            // Check identity of user to redirect page
            if (userDetail[userIndex][User.IDENTITY] === 0){
                // Redirect to the homepage
                window.location.href = '/DI Assignment Code Files/CapybaraExpress/menu.html';
            }
            else if (userDetail[userIndex][User.IDENTITY] === 1){
                // Redirect to the operatorpage
                window.location.href = '/operatorPage.html';
            }
        } 
        else {
            // Display error message
            alertBox.style.display = 'block';
        }
    });

    

    // Event listener for when user clicks on signup text
    signUpText.addEventListener('click', function () {
        // Redirect to the sign-up page
        window.location.href = 'signup.html';
    });

    
    // Function which checks whether password matches the user's passsword
    function userLoginValidation(input_username, input_password){
        // Finds index of username
        // Returns -1 if not found
        let locUserIndex = userDetail.findIndex(row => row[User.NAME] === input_username);

        // If not -1(user does not exist) and the password of user by index is same as input_password, return locUserIndex
        if ((locUserIndex !== -1) && (userDetail[locUserIndex][User.PASSWORD] === input_password))
            return locUserIndex;
        else 
            return -1;
    }
});