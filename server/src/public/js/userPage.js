const editButton = document.getElementById('edit-data-btn');
const dataList = document.getElementById('dataList');
const spans = dataList.getElementsByTagName('span');
const mediaRightDivs = document.querySelectorAll('.media-right');
const passwordChangeButton = document.getElementById('edit-password-btn');
const messageResponse2 = document.getElementById('message-response2');
const messageResponse1 = document.getElementById('message-response1');
const deactivateButton = document.getElementById('deactivate-btn');


let aTags = [];
let editMode = false;


mediaRightDivs.forEach(div => {
    let aTagsOfDiv = div.getElementsByTagName('a');
    aTags.push(aTagsOfDiv);
});
aTags.forEach(aTag => {
    aTag[0].addEventListener('click', async (e) => {
        e.preventDefault();

        let id = aTag[0].id;

        let res = await fetch(`/api/v1/users/removeFromWishlist/${id}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            }
        })

        let data = await res.json();

        if (data.status === 'success') {
            window.location.reload();
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        }
    })
})

const validateUserData = (name, phone, salary, martialState, gender) => {
    if (name.length < 8 || name.length > 40) {
        messageResponse1.innerText = 'Name must be between 8 and 40 characters!';
        messageResponse1.style.display = 'block';
        return false;
    }


    if (phone.length !== 11) {
        messageResponse1.innerText = 'Phone number must be 11 numbers!';
        messageResponse1.style.display = 'block';
        return false;
    }

    if (salary < 0) {
        messageResponse1.innerText = 'Salary must be positive!';
        messageResponse1.style.display = 'block';
        return false;
    }


    if (!['single', 'married', 'divorced', 'widowed'].includes(martialState)) {
        messageResponse1.innerText = 'Marital status must be one of the following: single, married, divorced, widowed!';
        messageResponse1.style.display = 'block';
        return false;
    }

    if (!['male', 'female'].includes(gender)) {
        messageResponse1.innerText = 'Gender  must be one of the following: male, female!';
        messageResponse1.style.display = 'block';
        return false;
    }

    messageResponse1.style.display = 'none';
    return true;
}

const updateUserData = async () => {

    let name = spans[0].getElementsByTagName('input')[0].value.trim(),
        address = spans[3].getElementsByTagName('input')[0].value.trim(),
        phone = spans[4].getElementsByTagName('input')[0].value.trim(),
        job = spans[7].getElementsByTagName('input')[0].value.trim(),
        salary = spans[8].getElementsByTagName('input')[0].value.trim(),
        martialState = spans[9].getElementsByTagName('input')[0].value.trim(),
        gender = spans[10].getElementsByTagName('input')[0].value.trim();


    console.log(phone)

    if (validateUserData(name, phone, salary, martialState, gender)) {
        let res = await fetch('/api/v1/users/updateMe', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                address,
                phoneNumber: phone,
                job,
                salary,
                maritalStatus: martialState,
                gender: gender.toLowerCase()
            })
        })

        let data = await res.json();

        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Data updated successfully!'
            })

            setTimeout(() => {
                window.location.reload();
            }, 1500);

        }

        if (data.status === 'error') {
            console.log(data)
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message,
            })
        }

        return true;
    }

    return false;
}


const editData = async () => {

    if (!editMode) {

        let wordsToCheck = ['Email', 'Date', 'NationalID', 'Nationality'];
        editMode = true;
        let skip;

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            skip = false;

            wordsToCheck.forEach(word => {
                if (span.parentNode.innerText.includes(word)) {
                    skip = true;
                }
            });

            if (!skip) {
                let input = document.createElement('input');
                input.type = 'text';
                input.value = span.innerHTML;
                span.innerHTML = '';
                span.appendChild(input);
            }
        }
        editButton.value = 'Save';
    } else {
        if (await updateUserData()) {
            editMode = false;
            for (let i = 0; i < spans.length; i++) {
                const span = spans[i];
                let input = span.getElementsByTagName('input')[0];
                if (input) {
                    span.innerHTML = input.value;
                }
            }
            editButton.value = 'Edit Info';
        }
    }
}


editButton.addEventListener('click', editData);

passwordChangeButton.addEventListener('click', async (e) => {

    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordConfirm = document.getElementById('new-password-confirm').value;


    if (newPassword !== newPasswordConfirm) {
        messageResponse2.innerText = 'New Passwords do not match!';
        messageResponse2.style.display = 'block';
    } else {
        let res = await fetch('/api/v1/users/updatePassword', {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                passwordCurrent: currentPassword,
                password: newPassword,
                passwordConfirm: newPasswordConfirm,
            })
        })

        let data = await res.json();

        console.log(data);

        if (data.status === 'success') {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Password changed successfully!'
            })
        } else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: data.message,
            })
        }
    }
});

deactivateButton.addEventListener('click', async (e) => {

    e.preventDefault();

    Swal.fire({
        title: 'Are you sure?',
        text: "You won't be able to revert this!",
        icon: 'warning',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33',
        confirmButtonText: 'Yes, deactivate it!'
    }).then(async (result) => {

        if (result.isConfirmed) {
            await fetch('/api/v1/users/deleteMe', {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                }
            })
                .then(()=>{
                    Swal.fire({
                        icon: 'success',
                        title: 'Success',
                        text: 'Account deactivated successfully!'
                    })
                    logout();
                    window.location.href = '/';
                })
        }
    })
});