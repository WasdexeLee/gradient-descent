document.addEventListener('DOMContentLoaded', function() {
    const signupForm = document.getElementById('signupForm');

    signupForm.addEventListener('submit', function(event) {
        event.preventDefault(); // Prevent the form from submitting immediately

        // Fetching the values from the input fields
        const password = document.getElementById('password').value;
        const confirmPassword = document.getElementById('confirmPassword').value;

        // Password match check
        if (password === confirmPassword) {
            // Here you'd typically send the data to the server and wait for a response
            // Assuming the response indicates a successful sign-up, proceed to redirect

            console.log("Sign-up successful. Redirecting to login page."); // Logging for demonstration
            
            // Redirect to login page
            window.location.href = 'login.html'; // Adjust the URL as needed
        } else {
            // If passwords don't match, inform the user
            alert("The passwords do not match. Please try again.");
        }
    });
});
