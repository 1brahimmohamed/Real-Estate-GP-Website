const form = document.getElementById('contact-form');

form.addEventListener('submit', async (e) => {
    e.preventDefault();

    const nameInput = form.elements['author'];
    const emailInput = form.elements['email'];
    const subjectInput = form.elements['subject'] || 'No subject'
    const messageInput = form.elements['comment'];

    if (!nameInput.value || !emailInput.value || !messageInput.value) {
        // Add error handling or display error messages to the user
        console.log('Please fill in all required fields');
    }

});