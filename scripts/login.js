console.log('Script loaded and running');
document.getElementById('loginForm').addEventListener('submit', async (e) => {
    e.preventDefault();

    console.log('Form submitted');

    const username = document.getElementById('username').value.trim();
    const errorDiv = document.getElementById('error');

    if (!username) {
        errorDiv.textContent = 'Please enter a username.';
        return;
    }


    try {
        //  user exists??
        const response = await axios.post('http://localhost/ExpenseTracker/php/login.php', {
            username: username
        });
        
        if (response.data.success) {
            // localStorage.setItem('user_id', userId);
            // localStorage.setItem('username', username);
            console.log(`Welcome back, ${username}!`);
            // log him
            window.location.href = 'http://localhost/ExpenseTracker/index.html'; 
        } else {
            //doesnt ?
            const createResponse = await axios.post('http://localhost/ExpenseTracker/php/create_user.php', {
                username: username
            });

            if (createResponse.data.success) {
                // localStorage.setItem('user_id', userId);
                // localStorage.setItem('username', username);
                // created user
                console.log('Account created successfully!');
                window.location.href = 'http://localhost/ExpenseTracker/index.html';
            } else {
                errorDiv.textContent = 'Error creating account.';
            }
        }
    } catch (error) {
        console.error('Error with login request:', error);
        errorDiv.textContent = 'An error occurred. Please try again.';
    }
});
