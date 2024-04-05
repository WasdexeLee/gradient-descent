document.addEventListener('DOMContentLoaded', function () {
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');

    let loginDetail = [];


    fetch('login.php')
    .then(phpResponse => phpResponse.json())
    .then(table => table.forEach(row => loginDetail.push(row)))
    .then(console.log(loginDetail))
    .catch(error => console.error('Errrooooorrrr: ', error));

    // console.log(loginDetail);

    loginForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const username = document.getElementById('username').value;
        const password = document.getElementById('password').value;
    
        // Placeholder for authentication logic
        if (usernameMatch(username, password)) {
            // Redirect to the homepage
            window.location.href = '/homepage.html';
        } else {
            // Display error message
            alertBox.style.display = 'block';
        }
    });

    
    signUpText.addEventListener('click', function () {
        // Redirect to the sign-up page
        window.location.href = '/signup.html';
    });

    
    function usernameMatch(input_username, input_password){
        loginDetail.forEach(row => {if (row[0] == input_username) return true;});

        let username_index = loginDetail.findIndex(row => row[0] === input_username);

        console.log(loginDetail[1][1], username_index);

        if ((username_index !== -1) && (loginDetail[username_index][1] === input_password))
            return true;
        else 
            return false;
    }


    
});