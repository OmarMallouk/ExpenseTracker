document.getElementById('signupForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    axios.post('http://localhost/ExpenseTracker/php/create_user.php', {
        username: username,
        password: password
    })
    .then(response => {
        if (response.data.success) {
            window.location.href = 'http://localhost/ExpenseTracker/pages/login.html'; 
        } else {
            document.getElementById('errorMessage').textContent = response.data.error;
        }
    })
    .catch(error => {
        console.error('Error during signup request:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
    });
});