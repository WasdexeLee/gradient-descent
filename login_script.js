document.addEventListener('DOMContentLoaded', function() {
  const loginForm = document.getElementById('loginForm');
  const signUpText = document.getElementById('signUp');
  const alertBox = document.getElementById('alert');

  loginForm.addEventListener('submit', function(event) {
      event.preventDefault();
      const username = document.getElementById('username').value;
      const password = document.getElementById('password').value;
      const identity = document.querySelector('input[name="identity"]:checked').value;

      // Placeholder for authentication logic
      if (username === 'admin' && password === 'password123') {
          // Redirect based on the selected identity
          if (identity === 'Operator') {
              window.location.href = '/operator.html';
          } else if (identity === 'Customer') {
              window.location.href = '/home.html';
          }
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
