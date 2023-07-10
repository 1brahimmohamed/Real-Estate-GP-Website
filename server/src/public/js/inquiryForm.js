const form = document.getElementById('inquiry-form');
const inquiryMessageResponse = document.getElementById('inquiry-message');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inquiryMessage = form.elements['message'].value;
    const propertyID = document.getElementById('property-id').innerText;
    const userID = document.getElementById('user-id') || null;

    if (userID) {
        try {
            await fetch('/api/v1/inquiries', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    user: userID.innerText,
                    property: propertyID,
                    message: inquiryMessage
                }),
            })
                .then(response => response.json())
                .then(resp => {
                    if (resp.status === 'success') {
                        inquiryMessageResponse.innerText = 'Inquiry sent!';
                        inquiryMessageResponse.style.color = 'green';
                        inquiryMessageResponse.style.display = 'block';
                    } else if (resp.status === 'fail') {
                        console.log(resp)
                        inquiryMessageResponse.innerText = 'Inquiry failed to send!';
                        inquiryMessageResponse.style.display = 'block';
                    }
                });
        } catch (err) {
            console.log(err);
        }
    }
    else {
        inquiryMessageResponse.innerText = 'You must be logged in to send an inquiry!\n Please login or register.';
        inquiryMessageResponse.style.display = 'block';
    }

});