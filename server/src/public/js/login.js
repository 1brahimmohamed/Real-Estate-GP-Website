const form = document.getElementById('login-form');
const errorMessage = document.getElementById('error-message');

const login = async (email, password) => {
    await fetch('/api/v1/users/login', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            email,
            password
        }),
    })
        .then(response => response.json())

        .then(resp => {
            errorMessage.style.display = 'none';

            if (resp.status === 'success') {
                Swal.fire({
                    icon: 'success',
                    title: 'You have successfully logged in!',
                    showConfirmButton: false,
                })
                setTimeout(() => {
                    if (resp.data.user.role === 'admin') {
                        window.location.href = '/admin';
                    }else {
                        window.location.href = '/';
                    }
                }, 1000);

            } else {
                errorMessage.innerHTML = resp.message;
                errorMessage.style.display = 'block';
            }
        })
        .catch(err => console.log(err));
};

form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = form.elements['email'].value;
    const password = form.elements['password'].value;

    console.log(email, password);

    login(email, password);
});