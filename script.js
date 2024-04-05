document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('loginForm');
    const signUpText = document.getElementById('signUp');
    const alertBox = document.getElementById('alert');
  
    loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
  
      // Placeholder for authentication logic
      if (username === 'admin' && password === 'password123') {
        // Redirect to the homepage
        window.location.href = '/homepage.html';
      } else {
        // Display error message
        alertBox.style.display = 'block';
      }
    });
  
    signUpText.addEventListener('click', function() {
      // Redirect to the sign-up page
      window.location.href = '/signup.html';
    });
  });
  