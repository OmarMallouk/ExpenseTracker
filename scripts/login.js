document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;

    axios.post('http://localhost/ExpenseTracker/php/login.php', {
        username: username,
        password: password
    })
    .then(response => {
        if (response.data.success) {
            localStorage.setItem('user_id', response.data.user_id);
            console.log('User logged in, user_id saved to localStorage');
            window.location.href = 'http://localhost/ExpenseTracker/pages/tracker.html';
          
        } else {
            
            document.getElementById('errorMessage').textContent = response.data.error;
        }
    })
    .catch(error => {
        console.error('Error during login request:', error);
        document.getElementById('errorMessage').textContent = 'An error occurred. Please try again.';
    });
});