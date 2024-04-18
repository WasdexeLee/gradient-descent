document.addEventListener('DOMContentLoaded', function () {
    const form = document.getElementById('profileForm');
    const editButton = document.getElementById('editButton');
    const submitButton = document.getElementById('submitButton');

    editButton.addEventListener('click', function () {
        const inputs = form.querySelectorAll('input');
        inputs.forEach(input => {
            if (input.name !== 'username') { // Keep username non-editable
                input.readOnly = false;
            }
        });
        submitButton.disabled = false;
    });

    form.addEventListener('submit', function (event) {
        event.preventDefault();
        const formData = new FormData(form);
        fetch('profile.php', {
            method: 'POST',
            body: formData
        }).then(response => response.text())
          .then(data => {
              alert('Profile updated successfully!');
              submitButton.disabled = true;
              form.querySelectorAll('input').forEach(input => input.readOnly = true);
          })
          .catch(error => console.error('Error:', error));
    });
});
