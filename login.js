document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    console.log('Login attempt:', { username, password });
    // Here you would typically send the login data to a server
    window.location.href = "index.html";
});