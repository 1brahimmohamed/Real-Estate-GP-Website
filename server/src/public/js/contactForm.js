const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.elements['author'];
    const emailInput = form.elements['email'];
    const subjectInput = form.elements['subject'] || 'No subject'
    const messageInput = form.elements['comment'];


    await fetch('/api/v1/messages', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({
            user: nameInput.value,
            email: emailInput.value,
            subject: subjectInput.value,
            message: messageInput.value
        }),
    }).then(response => response.json()).then(data => {
        console.log(data);
    });

});