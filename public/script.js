document.addEventListener('DOMContentLoaded', function() {

    let typingUsername = document.getElementById('typing-username');

    typingUsername.addEventListener('input', function() {
        let username = document.getElementById('hide-username');
        let value = this.value;
        if (value.length > 0) {
            username.style.display = 'none';
        } else {
            username.style.display = 'block';
        }
    });

    let typingPassword = document.getElementById('typing-password');

    typingPassword.addEventListener('input', function() {
        let password = document.getElementById('hide-password');
        let value = this.value;
        if (value.length > 0) {
            password.style.display = 'none';
        } else {
            password.style.display = 'block';
        }
    });

    let typingConfirmPassword = document.getElementById('typing-confirm-password');

    typingConfirmPassword.addEventListener('input', function() {
        let confirmPassword = document.getElementById('hide-confirm-password');
        let value = this.value;
        if (value.length > 0) {
            confirmPassword.style.display = 'none';
        } else {
            confirmPassword.style.display = 'block';
        }
    });

    let faEye = document.getElementsByClassName('fa-eye');

    faEye[0].addEventListener('click', function() {
        let password = document.getElementById('typing-password');
        if (password.type === 'password') {
            password.type = 'text';
        } else {
            password.type = 'password';
        }
    });

    faEye[1].addEventListener('click', function() {
        let password = document.getElementById('typing-confirm-password');
        if (password.type === 'password') {
            password.type = 'text';
        } else {
            password.type = 'password';
        }
    });

    let loginForm = document.getElementById('login-form');

    loginForm.addEventListener('submit', async function(event) {
        event.preventDefault();

        const formData = new FormData(loginForm);

        try {
            console.log('Before fetch request');
            // Send a POST request to the server
            const response = await fetch('/login', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/x-www-form-urlencoded'
              },
              body: formData
            });
            console.log('After fetch request');
            const data = await response.json();

              if (response.ok) {
                // Login successful
                alert(data.message); // You can replace this with your desired way of displaying success messages
              } else {
                // Display error messages
                alert(data.error);
              }
            } catch (error) {
              console.error('Error:', error);
              alert('An unexpected error occurred. Please try again.');
            }
    });

});

