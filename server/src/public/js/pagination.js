const paginationLinks = document.querySelectorAll('.pagination a[data-page]');
const sortElements = document.getElementById('sort');
const limitElements = document.getElementById('limit');

// let limit = document.getElementById('limit').value;
// let selectedPage = 1;
// let sortBy = document.getElementById('sort').value;

let limit = parseInt(document.getElementById('limitedPageVal').innerText);
let selectedPage = parseInt(document.getElementById('activePageVal').innerText);
let sortBy =  parseInt(document.getElementById('selectedOptionVal').innerText);

paginationLinks.forEach(link => {
    link.addEventListener('click', event => {
        event.preventDefault();

        selectedPage = link.getAttribute('data-page');

        // Redirect the browser to the new URL
        window.location.href = `http://localhost:3000/properties/?sort=${sortBy}&page=${selectedPage}&limit=${limit}`;
    });
});

sortElements.addEventListener('change', () => {
    console.log('etlk')
    sortBy = sortElements.value;
    window.location.href = `http://localhost:3000/properties/?sort=${sortBy}&page=${selectedPage}&limit=${limit}`;
});

limitElements.addEventListener('change', () => {
    console.log('esafsdftlk')

    limit = limitElements.value;
    window.location.href = `http://localhost:3000/properties/?sort=${sortBy}&page=${selectedPage}&limit=${limit}`;
});