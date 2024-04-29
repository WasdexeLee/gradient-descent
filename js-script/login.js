document.addEventListener('DOMContentLoaded', function () {
    // Init variable to store form, signuptext and alertbox 
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');
    // To store user details
    let validity = '';
    let identity = -1;
    let user_id = -1;




    // Event listener for when form is submitted
    loginForm.addEventListener('submit', function (event) {
        // Prevents default submission for the form 
        event.preventDefault();

        // Init var to store the username and password entered by user
        const username = loginForm.username.value;
        const password = loginForm.password.value;

        // Check user validity by pushing username and password to php
        userLoginValidation(username, password)
            .then(() => {
                // Check if password matches for the username
                if (validity === "true") {
                    localStorage.setItem('user_id', user_id);

                    // Check identity of user to redirect page
                    if (identity === 0) {
                        // Redirect to the homepage
                        window.location.href = '../html/index.html';
                    }
                    else if (identity === 1) {
                        // Redirect to the operatorpage
                        window.location.href = '../html/admin.html';
                    }
                }
                else if (validity === "false") {
                    // Display error message
                    alertBox.style.display = 'block';
                }
            });
    });


    // Event listener for when user clicks on signup text
    signUpText.addEventListener('click', function () {
        // Redirect to the sign-up page
        window.location.href = '../html/signup.html';
    });


    // Function which checks whether password matches the user's passsword
    function userLoginValidation(input_username, input_password) {
        // Append login data into FormData object to pass to php
        let locFormData = new FormData();

        // Append necessary info for php
        locFormData.append('user_name', input_username);
        locFormData.append('user_password', input_password);

        // Call fetch API to pass data to login.php
        // Use POST method, passes locFormData, wait for response and log to console
        return fetch('../php-script/login.php', { method: 'POST', body: locFormData })
            .then(response => response.json())
            .then(data => {
                validity = data[0];
                identity = parseInt(data[1]);
                user_id = data[2];
            })
            .catch(error => console.error("ERROR: ", error));
    }
});