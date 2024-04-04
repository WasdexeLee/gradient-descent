// ... Event listeners remain the same ...

// Inside the login form 'submit' event listener
if (username === 'admin' && password === 'password123') {
    // Redirect to the homepage
    window.location.href = '/homepage.html';
  } else {
    // Display error message
    alertBox.style.display = 'block';
  }
  