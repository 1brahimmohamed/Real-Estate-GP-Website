const editButton = document.getElementById('edit-data-btn');
const dataList = document.getElementById('dataList');
const spans = dataList.getElementsByTagName('span');
const mediaRightDivs = document.querySelectorAll('.media-right');
const passwordChangeButton = document.getElementById('edit-password-btn');
const messageResponse = document.getElementById('message-response');

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

const editData = () => {

    if (!editMode) {

        editMode = true;

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            let input = document.createElement('input');
            input.value = span.innerHTML;
            span.innerHTML = '';

            input.style.cssText = `
            border: 1px solid #ccc;
            background-color: transparent;
            border-radius: 5px;
            height: 3rem;
        `;
            span.appendChild(input);
        }

        editButton.value = 'Save';
    } else {

        editMode = false;

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            let input = span.getElementsByTagName('input')[0];
            span.innerHTML = input.value;
        }

        editButton.value = 'Edit Info';
    }
}


editButton.addEventListener('click', editData);

passwordChangeButton.addEventListener('click', async (e) => {

    e.preventDefault();

    const currentPassword = document.getElementById('current-password').value;
    const newPassword = document.getElementById('new-password').value;
    const newPasswordConfirm = document.getElementById('new-password-confirm').value;


    if (newPassword !== newPasswordConfirm) {
        messageResponse.innerText = 'New Passwords do not match!';
        messageResponse.style.display = 'block';
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

