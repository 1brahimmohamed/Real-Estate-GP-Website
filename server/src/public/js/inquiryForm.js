const form = document.getElementById('inquiry-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const inquiryMessage = form.elements['message'].value;
    const propertyID = document.getElementById('property-id').innerText;


    console.log(inquiryMessage, propertyID);

    await fetch('/api/v1/inquiries', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            Authorization: "Bearer " + "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTAzYjJhNTg1MmM5YWFhMWFhNzA3ZCIsImlhdCI6MTY4ODkyOTU4NiwiZXhwIjoxNjk2NzA1NTg2fQ.Qr_kFF41IO0cNPOJ9QvQu6ZuWm_ExgQeXhFgilLk28s",

        },
        body: JSON.stringify({
            user: "64a03b2a5852c9aaa1aa707d",
            property: propertyID,
            message: inquiryMessage
        }),
    }).then(response => response.json()).then(data => {
        console.log(data);
    });

});