window.addEventListener('scroll', function() {
    const scrollImage = document.getElementById('logo-img');
    const scrollPosition = window.scrollY;

    if (scrollPosition > 200) {
        scrollImage.src = '/img/logo/cropped black.png';
    } else {
        scrollImage.src = '/img/logo/cropped.png';
    }
});


