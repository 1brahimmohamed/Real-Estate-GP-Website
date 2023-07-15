const resolvedBtn = document.getElementById('resolvedBtn')
const pendingBtn = document.getElementById('pendingBtn')
const rejectedBtn = document.getElementById('rejectedBtn')

let url = window.location.href
let id = url.substring(url.lastIndexOf('/') + 1)

let whichOne = document.getElementById('titleInfo').innerText
let urlToFetch = '/api/v1/inquiries/';

if (whichOne.includes('Message'))
    urlToFetch = '/api/v1/messages/';


console.log(urlToFetch)

resolvedBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    await fetch(`${urlToFetch}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: `${whichOne.includes('Message') ? 'responded' : 'resolved'}`
        }),
    }).then(res => {
        if (res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `${whichOne.includes('Message') ? 'Message' : 'Inquiry'} Resolved`,
                timer: 1500
            })

            setTimeout(()=>{
                window.location.reload()
            })
        }
    })
})

pendingBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    await fetch(`${urlToFetch}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'pending'
        }),
    }).then(res => {
        if (res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: `${whichOne.includes('Message') ? 'Message' : 'Inquiry'} Pending`,
                timer: 1500
            })

            setTimeout(()=>{
                window.location.reload()
            })
        }
    })
})

rejectedBtn.addEventListener('click', async (e) => {

    e.preventDefault()

    await fetch(`${urlToFetch}${id}`, {
        method: 'PATCH',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            status: 'rejected'
        }),
    }).then(res => {
        if (res.status === 200) {
            Swal.fire({
                icon: 'success',
                title: 'Success',
                text: 'Inquiry Rejected',
                timer: 1500
            })

            setTimeout(()=>{
                window.location.reload()
            })

        }
    })
})