const form = document.getElementById('user-data')
const dataBtn = document.getElementById('dataBtn')
const errorMessage = document.getElementById('message-response')

const setDate = () => {
    const date = document.getElementById('date').getAttribute('data')
    let jsDate = new Date(date)

    const year = jsDate.getFullYear();
    const month = (jsDate.getMonth() + 1).toString().padStart(2, '0');
    const day = jsDate.getDate().toString().padStart(2, '0');

    document.getElementById('date').value = `${year}-${month}-${day}`;
}

setDate()

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



dataBtn.addEventListener('click', async (e) => {
    e.preventDefault()

    let name                    = form.elements['name'].value.trim(),
        email                   = form.elements['email'].value.trim(),
        phone                   = form.elements['phone'].value.trim(),
        address                 = form.elements['address'].value.trim(),
        nationality             = form.elements['nationality'].value.trim(),
        nationalityId           = form.elements['nationalID'].value.trim(),
        birthDate               = form.elements['date'].value.trim(),
        job                     = form.elements['job'].value.trim(),
        salary                  = form.elements['salary'].value.trim(),
        maritalStatus           = form.elements['martial-state'].value.trim(),
        gender                  = form.elements['gender'].value.trim();


    let valid = dataValidation(name, email, phone, address, nationality, nationalityId, birthDate, maritalStatus, gender)




    if (valid) {
        const url = window.location.href;
        const id = url.substring(url.lastIndexOf('/') + 1);

        let res = await fetch(`/api/v1/users/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                email,
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
            errorMessage.style.display = 'none';

            Swal.fire({
                icon: 'success',
                title: 'Data updated successfully',
                showConfirmButton: false,
                timer: 1500
            })
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message,
            })
        }
    }

})
