const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    const category = document.getElementById('category').value;
    const location = document.getElementById('location').value;
    const duplex = document.getElementById('duplexType').value;

    window.location.href = `http://localhost:3000/properties/?type=${category}&city=${location}&duplex=${duplex}`;
});

