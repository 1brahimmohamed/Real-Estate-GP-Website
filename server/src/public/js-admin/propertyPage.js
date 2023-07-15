const form = document.getElementById('property-data')
const dataBtn = document.getElementById('dataBtn')
const errorMessage = document.getElementById('message-response')
const deleteBtn = document.getElementById('deleteBtn')

let add = false;

if (window.location.href.includes('add'))
    add = true;


const propertyDataValidation = (
    name,
    slug,
    price,
    offer,
    city,
    area,
    address,
    type,
    rooms,
    bathrooms,
    balconies,
    squareMeters,
    floor,
) => {
    if (name.length < 8 || name.length > 40) {
        errorMessage.innerText = 'Name must be between 8 and 40 characters';
        errorMessage.style.display = 'block';
        return false;
    }

    if (price < 0) {
        errorMessage.innerText = 'Price must be a positive number';
        errorMessage.style.display = 'block';
        return false;
    }

    if (price < offer) {
        errorMessage.innerText = 'Offer price must be below regular price';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!city) {
        errorMessage.innerText = 'A property must have a city';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!area) {
        errorMessage.innerText = 'A property must have an area';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!address) {
        errorMessage.innerText = 'A property must have an address';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!['apartment', 'house', 'office', 'villa'].includes(type)) {
        errorMessage.innerText = 'Property type is either: apartment, house, office, villa';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!rooms) {
        errorMessage.innerText = 'A property must have a number of rooms';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!squareMeters) {
        errorMessage.innerText = 'A property must have a number of square meters';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!bathrooms) {
        errorMessage.innerText = 'A property must have a number of bathrooms';
        errorMessage.style.display = 'block';
        return false;
    }

    if (!floor) {
        errorMessage.innerText = 'A property must have a floor';
        errorMessage.style.display = 'block';
        return false;
    }

    return true;
};


dataBtn.addEventListener('click', async (e) => {
    e.preventDefault();

    const name = form.elements['name'].value,
        slug = form.elements['slug'].value,
        price = parseInt(form.elements['price'].value),
        offer = parseInt(form.elements['offer'].value) || 0,
        city = form.elements['city'].value,
        area = form.elements['area'].value,
        address = form.elements['address'].value,
        type = form.elements['type'].value,
        rooms = parseInt(form.elements['rooms'].value),
        bathrooms = parseInt(form.elements['bathrooms'].value),
        balconies =parseInt(form.elements['balconies'].value),
        squareMeters = parseInt(form.elements['squareMeters'].value),
        floor =parseInt(form.elements['floor'].value),
        duplex = form.elements['duplex'].value,
        description = form.elements['description'].value;


    const valid = propertyDataValidation(
        name,
        slug,
        price,
        offer,
        city,
        area,
        address,
        type,
        rooms,
        bathrooms,
        balconies,
        squareMeters,
        floor,
    );



    if (valid) {
        const url = window.location.href;
        let method, id;

        if (add){
            id  = ''
            method = 'POST'
        }
        else{
            id = url.substring(url.lastIndexOf('/') + 1);
            method = 'PATCH'
        }


        let res = await fetch(`/api/v1/properties/${id}`, {
            method: method,
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({
                name,
                slug,
                price,
                offer,
                city,
                area,
                address,
                type,
                rooms,
                bathrooms,
                balconies,
                squareMeters,
                floor,
                duplex,
                description
            })
        })
            .then(res => res.json())
            .then(data => {
                console.log(data)

                if (data.status === 'success') {
                    errorMessage.style.display = 'none';

                    Swal.fire({
                        icon: 'success',
                        title: `${add? 'Added' : 'Updated'} successfully`,
                        showConfirmButton: false,
                        timer: 1500
                    })
                } else {
                    Swal.fire({
                        icon: 'error',
                        title: 'Oops...',
                        text: data.message,
                    })
                }
            })
    }


});

if (deleteBtn){

    deleteBtn.addEventListener('click', async (e) => {
        e.preventDefault()

        const url = window.location.href;
        const id = url.substring(url.lastIndexOf('/') + 1);

        Swal.fire({
            title: 'Are you sure?',
            text: "You won't be able to revert this!",
            icon: 'warning',
        }).then(async (result) => {
            await fetch(`/api/v1/properties/${id}`, {
                method: 'DELETE',
            })
                .then(data =>{
                    console.log(data)
                    if (data.status === 204) {
                        errorMessage.style.display = 'none';

                        Swal.fire({
                            icon: 'success',
                            title: 'Property deleted successfully',
                            showConfirmButton: false,
                            timer: 1500
                        }).then(() => {
                            window.location.href = '/admin/properties'
                        })
                    }
                    else {
                        Swal.fire({
                            icon: 'error',
                            title: 'Oops...',
                            text: data.message,
                        })
                    }
                });
        })
    })
}