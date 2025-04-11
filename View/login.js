const loginForm = document.getElementById('login-form');
const loginButton = document.getElementById('login-button');
const loginMessage = document.getElementById('login-message');

loginButton.addEventListener('click', (e) => {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    if (username && password) {
        var xhr = new XMLHttpRequest(),
        formData = new FormData();

        formData.append("username", username);
        formData.append("password", password);
        xhr.open('POST','../Model/login.php', false);
        xhr.onload = function() {
            if (xhr.responseText === '{"success":true}') {
                loginMessage.textContent = 'Login successful!';
                setTimeout(() => {
                    window.location.href = 'index.php';
                }, 2000);
            } else {
                loginMessage.textContent = 'Login failed!';
            }
        };
        xhr.send(formData);
    } else {
        loginMessage.textContent = 'Please fill out all fields!';
    }
});
