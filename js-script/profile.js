document.addEventListener('DOMContentLoaded', function () {
    const editButton = document.getElementById('editButton');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    console.log(inputs);

    editButton.addEventListener('click', function () {
        if (editButton.innerText === "Edit") {
            inputs.forEach(input => {
                input.classList.add('editable');
                input.readOnly = false;
            });
            editButton.innerText = "Submit";
        } else {
            const form = document.getElementById('profileForm');
            const formData = new FormData(form);

            // fetch('profile.php', {
            //     method: 'POST',
            //     body: formData
            // })
            // .then(response => response.text())
            // .then(data => {
            //     alert('Profile updated successfully!');
                inputs.forEach(input => {
                    input.classList.remove('editable');
                    input.readOnly = true;
 
                });
                editButton.innerText = "Edit";
  
            // })
            // .catch(error => console.error('Error:', error));
        }
    });
});
