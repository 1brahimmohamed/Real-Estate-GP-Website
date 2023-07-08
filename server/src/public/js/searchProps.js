const searchBtn = document.getElementById('searchBtn');

searchBtn.addEventListener('click', (evt) => {
    evt.preventDefault();

    const category = document.getElementById('category').value || '';
    const location = document.getElementById('location').value || '';
    const duplex = document.getElementById('duplexType').value || false;

    const lowerPrice = parseInt(document.getElementById('skip-value-lower2').innerText);
    const upperPrice = parseInt(document.getElementById('skip-value-upper2').innerText);

    const lowerArea = parseInt(document.getElementById('skip-value-lower').innerText);
    const upperArea = parseInt(document.getElementById('skip-value-upper').innerText);

    console.log(category, location, duplex, lowerPrice, upperPrice, lowerArea, upperArea)
    window.location.href = `http://localhost:3000/properties/?type=${category}&city=${location}&duplex=${duplex}&price[gte]=${lowerPrice}&price[lte]=${upperPrice}&squareMeters[gte]=${lowerArea}&squareMeters[lte]=${upperArea}`;
});

