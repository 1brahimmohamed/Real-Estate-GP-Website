const form = document.getElementById('signup-form');
const errorMessage = document.getElementById('error-message');
const signupButton = document.getElementById('signup-btn');


const signup = async (name,
                      email,
                      password,
                      confirmPassword,
                      phone, nationalId,
                      nationality,
                      dateOfBirth
) => {

    let res = await fetch('/api/v1/users/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            name: name,
            email: email,
            password: password,
            passwordConfirm: confirmPassword,
            dateOfBirth: dateOfBirth,
            phoneNumber: phone,
            nationality: nationality,
            nationalID: nationalId
        }),
    });

    let resp = await res.json();

    if (resp.status === 'success') {
        errorMessage.style.display = 'none';
        Swal.fire({
            icon: 'success',
            title: 'You have successfully signed up!',
            showConfirmButton: false,
        })
        setTimeout(() => {
            window.location.href = '/';
        }, 1000);
    } else {

        if (resp.message.includes('email_1 dup key')) {
            errorMessage.innerText = 'This email is already taken!';
            errorMessage.style.display = 'block';
        }
        else {
        errorMessage.innerText = 'Sign up failed! please try again';
        errorMessage.style.display = 'block';
        }

    }

};

const validateData = (name,
                      email,
                      password,
                      confirmPassword,
                      phone, nationalId,
                      nationality,
                      dateOfBirth) => {

    if (name.length < 8 || name.length > 40) {
        errorMessage.innerText = 'Name must be between 8 and 40 characters';
        errorMessage.style.display = 'block';
        return true;
    }

    if (password !== confirmPassword) {
        errorMessage.innerText = 'Passwords are not the same!';
        errorMessage.style.display = 'block';
        return true;
    }

    if (nationalId.length !== 14) {
        errorMessage.innerText = 'A user national ID must be 14 numbers';
        errorMessage.style.display = 'block';
        return true;
    }

    if (phone.length !== 11) {
        errorMessage.innerText = 'A user phone number must be 11 numbers';
        errorMessage.style.display = 'block';
        return true;
    }

    let date = new Date(dateOfBirth);
    let today = new Date();

    if (date > today) {
        errorMessage.innerText = 'A user date of birth must be before today';
        errorMessage.style.display = 'block';
        return true;
    }

    let ageDiff = today.getFullYear() - date.getFullYear();
    if (ageDiff < 18) {
        errorMessage.innerText = 'A user must be at least 18 years old';
        errorMessage.style.display = 'block';
        return true;
    }

}

signupButton.addEventListener('click', (e) => {

    const email = form.elements['email'].value;
    const password = form.elements['password'].value;
    const confirmPassword = form.elements['password-confirm'].value;
    const name = form.elements['name'].value;
    const phone = form.elements['phone-number'].value;
    const nationalId = form.elements['ssn'].value;
    const nationality = form.elements['nationality'].value;
    const dateOfBirth = form.elements['date-birth'].value;

    if (
        validateData(name,
        email,
        password,
        confirmPassword,
        phone, nationalId,
        nationality,
        dateOfBirth))
        return;

    signup(name, email, password, confirmPassword, phone, nationalId, nationality, dateOfBirth);
});

