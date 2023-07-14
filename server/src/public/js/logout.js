
const btnLogout = document.getElementById('logout-btn');

const logout = async () => {
    try{
        await fetch('/api/v1/users/logout', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
        }).then(response => response.json()).then(resp => {
            if (resp.status === 'success') {
                let url = window.location.href;
                if (url.includes('profile'))
                    window.location.href = '/';
                else
                    window.location.href = url;
            }
        })
    }catch (err) {
        Swal.fire({
            icon: 'error',
            title: 'Oops... error logging out! Try again later.',
            showConfirmButton: false,
            timer: 1000
        })
    }
};

if (btnLogout) {
    btnLogout.addEventListener('click', (e) => {
        e.preventDefault();
        logout();
    });
}