window.addEventListener('scroll', function() {
    const scrollImage = document.getElementById('logo-img');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 200) {
        scrollImage.src = 'img/logo/cropped black.png';
    } else {
        scrollImage.src = 'img/logo/cropped.png';
    }
});


fetch('https://localhost:3000/api/v1/properties', {
    method: 'GET',
    headers: {
        'Connection': 'keep-alive',
        'Host': 'localhost:3000',
        'User-Agent': 'PostmanRuntime/7.32.3',
        'Accept': '*/*',
        'Accept-Encoding': 'gzip, deflate, br',
        'Content-Type': 'application/json',
        'Cookie': 'jwt=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTAzYjBjNTg1MmM5YWFhMWFhNzA3YiIsImlhdCI6MTY4ODY1NTE4NywiZXhwIjoxNjk2NDMxMTg3fQ.H4ipSRyyRo73yEvtB1jtkqrQGK64HRrssxaAYNVOSyU',
        'authorization': 'Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY0YTAzNzRkYWZkZjI1NTA4NzA2NTFmNSIsImlhdCI6MTY4ODIyMTUxNywiZXhwIjoxNjk1OTk3NTE3fQ.hfu9CUTY4T7CIWxiJs002XDLcZeUw-7fKbDeQLmq_jI'
    },
}).then(res => {
    console.log(res.data);
}).catch(err => console.log(err));