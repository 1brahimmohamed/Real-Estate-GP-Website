const editButton = document.getElementById('edit-data-btn');

editButton.addEventListener('click', editData);

const dataList = document.getElementById('dataList');
const spans = dataList.getElementsByTagName('span');

const mediaRightDivs = document.querySelectorAll('.media-right');
let aTags = [];

mediaRightDivs.forEach(div => {
    let aTagsOfDiv = div.getElementsByTagName('a');
    aTags.push(aTagsOfDiv);
});

let editMode = false;

function editData() {

    if (!editMode){

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
    }
    else {

        editMode = false;

        for (let i = 0; i < spans.length; i++) {
            const span = spans[i];
            let input = span.getElementsByTagName('input')[0];
            span.innerHTML = input.value;
        }

        editButton.value = 'Edit Info';
    }
}


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
        }
        else {
            Swal.fire({
                icon: 'error',
                title: 'Oops...',
                text: 'Something went wrong!'
            })
        }
    })
})