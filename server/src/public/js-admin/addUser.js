const form = document.getElementById('user-data');
const addBtn = document.getElementById('add-btn');
const errorMessage = document.getElementById('message-response')

const validatePassword = (password, passwordConfirm) => {

        if (password !== passwordConfirm) {
            errorMessage.innerText = 'Password and password confirmation must match';
            errorMessage.style.display = 'block';
            return false;
        }

        return true;
}

const dataValidation = (name
    ,email
    ,phone
    ,address
    ,nationality
    ,nationalityId
    ,birthDate
    ,maritalStatus
    ,gender
) => {

    if (name.length < 8 || name.length > 40) {
        errorMessage.innerText = 'Name must be between 8 and 40 characters';
        errorMessage.style.display = 'block';
        return false;
    }

    if (nationalityId.length !== 14) {
        errorMessage.innerText = 'A user national ID must be 14 numbers';
        errorMessage.style.display = 'block';
        return false;
    }

    if (phone.length !== 11) {
        errorMessage.innerText = 'A user phone number must be 11 numbers';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!birthDate) {
        errorMessage.innerText = 'A user date of birth is required';
        errorMessage.style.display = 'block';
        return false;
    }

    let date = new Date(birthDate);
    let today = new Date();

    if (date > today) {
        errorMessage.innerText = 'A user date of birth must be before today';
        errorMessage.style.display = 'block';
        return false;
    }

    let ageDiff = today.getFullYear() - date.getFullYear();
    if (ageDiff < 18) {
        errorMessage.innerText = 'A user must be at least 18 years old';
        errorMessage.style.display = 'block';
        return false;
    }

    console.log(maritalStatus)
    if (!['married', 'single', 'divorced', 'widowed'].includes(maritalStatus)) {
        errorMessage.innerText = 'A user marital status must be one of the following: married, single, divorced, widowed';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!['male', 'female'].includes(gender)) {
        errorMessage.innerText = 'A user gender must be one of the following: male, female';
        errorMessage.style.display = 'block';
        return false;
    }

    return true;

}


addBtn.addEventListener('click', async (e) => {

    e.preventDefault();

    let name                    = form.elements['name'].value.trim(),
        email                   = form.elements['email'].value.trim(),
        phone                   = form.elements['phone'].value.trim(),
        password                = form.elements['password'].value.trim(),
        passwordConfirm         = form.elements['password-confirm'].value.trim(),
        address                 = form.elements['address'].value.trim(),
        nationality             = form.elements['nationality'].value.trim(),
        nationalityId           = form.elements['nationalID'].value.trim(),
        birthDate               = form.elements['date'].value.trim(),
        job                     = form.elements['job'].value.trim(),
        salary                  = form.elements['salary'].value.trim(),
        maritalStatus           = form.elements['martial-state'].value.trim(),
        gender                  = form.elements['gender'].value.trim();


    let valid = dataValidation(name, email, phone, address, nationality, nationalityId, birthDate, maritalStatus, gender)
    let validPassword = validatePassword(password, passwordConfirm);


    if (valid && validPassword) {
        let res = await fetch('/api/v1/users', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
                password,
                passwordConfirm,
                phoneNumber: phone,
                address,
                nationality,
                nationalID: nationalityId,
                dateOfBirth: birthDate,
                job,
                salary,
                maritalStatus,
                gender
            })
        });

        let data = await res.json();

        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'User added successfully',
                showConfirmButton: false,
                timer: 1500
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message
            })
        }
    }
});