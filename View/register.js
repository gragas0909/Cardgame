const registerForm = document.getElementById('register-form');
const registerButton = document.getElementById('register-button');
const registerMessage = document.getElementById('register-message');

registerButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirm-password').value;

    if (username && password && confirmPassword) {
        if (password === confirmPassword) {
            var xhr = new XMLHttpRequest(),
            formData = new FormData();

            formData.append("username", username);
            formData.append("password", password);
            xhr.open('POST','../Model/register.php', false);
            xhr.onload = function() {
                if (xhr.responseText === '{"success":true}') {
                    window.location.href = 'index.php';
                } else {
                    registerMessage.textContent = 'Registration failed!';
                }
            };
            xhr.send(formData);
        } else {
            registerMessage.textContent = 'Passwords do not match!';
        }
    } else {
        registerMessage.textContent = 'Please fill out all fields!';
    }
});
