document.addEventListener('DOMContentLoaded', function () {
    // Forces user to login 
    if (localStorage.getItem('user_id') === null)
        window.location.href = '../html/login.html';


    const editButton = document.getElementById('editButton');
    const inputs = document.querySelectorAll('input[type="text"], input[type="email"], input[type="tel"]');
    const profileForm = document.getElementById('profileForm');
    // const username = document.getElementById('username');
    // const useremail = document.getElementById('email');
    // const useraddress = document.getElementById('address');
    // const userphone = document.getElementById('phone');
    console.log(inputs);

    //fetch and show the information of user
    formData = new FormData();
    formData.append('func', 'getUser');
    formData.append('user_id', localStorage.getItem('user_id'));

    fetch('../php-script/profile.php', {
        method: 'POST',
        body: formData,
    })
        .then(phpResponse => phpResponse.json())
        .then(userInfo => {
            console.log(userInfo);
            profileForm.username.value = userInfo[0];
            profileForm.email.value = userInfo[1];
            profileForm.address.value = userInfo[2];
            profileForm.phone.value = userInfo[3];
        });


    //the edit and submit function
    editButton.addEventListener('click', function () {
        if (editButton.innerText === "Edit") {
            //the eidt button change to submit button
            inputs.forEach(input => {
                input.classList.add('editable');
                input.readOnly = false;
            });
            editButton.innerText = "Submit";
        } else {
            //modify the information
            formData = new FormData();
            formData.append('func', 'modifyUser')
            formData.append('user_id', localStorage.getItem('user_id'));
            formData.append('user_name', profileForm.username.value);
            formData.append('user_email', profileForm.email.value);
            formData.append('user_address', profileForm.address.value);
            formData.append('user_phone', profileForm.phone.value);

            //for check
            console.log(formData);

            fetch('../php-script/profile.php', {
                method: 'POST',
                body: formData
            })
                .then(response => response.text())

                .then(d => console.log(d))


                //tell the user that the data has been updated and remove the editable attribute
                .then(data => {
                    alert('Profile updated successfully!');
                    inputs.forEach(input => {
                        input.classList.remove('editable');
                        input.readOnly = true;

                    });





                    editButton.innerText = "Edit";

                })
                .catch(error => console.error('Error:', error));
        }
    });
});
