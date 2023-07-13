
const fireError = () => {
    swal.fire({
        title: 'Property failed to save!',
        icon: 'error',
        confirmButtonText: 'OK'
    });
};
document.getElementById('save-btn').addEventListener('click', async function() {
    const propertyID = document.getElementById('property-id').innerText;
    const userID = document.getElementById('user-id') || null;

    if (!userID) {
        swal.fire({
            title: 'You must be logged in to save a property!',
            icon: 'error',
            confirmButtonText: 'OK'
        });
    }

    try {
        await fetch(`/api/v1/users/addToWishlist/${propertyID}`, {
            method: 'PATCH',
            headers: {
                'Content-Type': 'application/json',
            },
        }).then(response => response.json())
            .then(resp => {
                if (resp.status === 'success') {
                    swal.fire({
                        title: 'Property saved!',
                        icon: 'success',
                        confirmButtonText: 'OK'
                    });
                } else if (resp.status === 'fail') {
                    fireError(resp.messages);
                }
            });
    }
    catch (err) {
        fireError();
    }
});