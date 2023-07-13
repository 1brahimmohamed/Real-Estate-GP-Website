const dataType = document.getElementById('data-type');
const header = document.getElementById('header-row');
const sorting = document.getElementById('selection-id');
let table = document.getElementById('data-rows');

let currentData = [];
let currentHeader = [];

const capitalizeFirstLetter = (string) => {
    return string.charAt(0).toUpperCase() + string.slice(1);
};


const dataRendering = async () => {

    let headerItems, data;

    if (dataType.innerText === 'Users') {
        [headerItems, data] = await getUsersData();

    } else if (dataType.innerText === 'Properties')
        [headerItems, data] = await getPropertyData();

    else if (dataType.innerText === 'Messages')
        [headerItems, data] = await getMessagesData();

    else if (dataType.innerText === 'Inquires') {
        [headerItems, data] = await getInquiriesData();
        currentData = data;
        currentHeader = headerItems;
        return renderInquiriesData(headerItems, data);
    }

    currentData = data;
    currentHeader = headerItems;
    renderData(headerItems, data);
};

const getUsersData = async () => {
    const res = await fetch('/api/v1/users', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })
    let data = await res.json();

    data = data.data.users;


    let headerItems = [
        'name',
        'email',
        'nationality',
        'nationalID',
        'gender',
        'job',
        'phoneNumber',
        'savedProperties',
        'active',
    ]

    return [headerItems, data];
}

const getPropertyData = async () => {

    const res = await fetch('/api/v1/properties', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })


    let data = await res.json();
    console.log(data)
    data = data.data.properties;

    let headerItems = [
        'name',
        'price',
        'squareMeters',
        'city',
        'area',
        'type',
        'floor',
        'rooms',
        'bathrooms',
        'balconies',
        'duplex',
        'ratingAverage',
        'ratingQuantity',
        'special',
    ]

    return [headerItems, data];
};


const getMessagesData = async () => {

    const res = await fetch('/api/v1/messages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let data = await res.json();
    data = data.data.messages;

    let headerItems = [
        'name',
        'email',
        'subject',
        'createdAt',
        'status',
    ]

    return [headerItems, data];

};


const getInquiriesData = async () => {

    const res = await fetch('/api/v1/inquiries', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        }
    })

    let data = await res.json();
    data = data.data.inquiries;

    let headerItems = [
        'user',
        'property',
        'job',
        'email',
        'phoneNumber',
        'createdAt',
        'status',
    ]

    return [headerItems, data];
};


const renderData = (headerItems, data, selectedOpt) => {

    // render header
    renderSelectedData(headerItems,selectedOpt);

    data.forEach(dataItem => {
        let tr = document.createElement('tr');

        headerItems.forEach(item => {

            let td = document.createElement('td');
            td.classList.add('border-bottom-0');

            if (item !== 'active') {
                if (item === 'savedProperties')
                    td.innerHTML = `<p class="fw-normal mb-0 fs-4">${dataItem[item].length}</p>`
                else
                    td.innerHTML = `<p class="fw-normal mb-0 fs-4">${dataItem[item]}</p>`
            } else {
                td.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                         <span class="badge ${dataItem.active ? 'bg-success' : 'bg-danger'}"> ${dataItem.active ? 'Active' : 'Not Active'} </span>
                    </div>
                    `
            }

            if (item === 'duplex')
                td.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                         <span class="badge ${dataItem.duplex ? 'bg-success' : 'bg-primary'}"> ${dataItem.duplex ? 'Duplex' : 'Normal'} </span>
                    </div>`


            if (item === 'duplex')
                td.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                         <span class="badge ${dataItem.duplex ? 'bg-success' : 'bg-primary'}"> ${dataItem.duplex ? 'Duplex' : 'Normal'} </span>
                    </div>
                `

            if (item === 'createdAt')
                td.innerHTML = `<p class="fw-normal mb-0 fs-4">${new Date(dataItem[item]).getFullYear()}-${(new Date(dataItem[item]).getMonth() + 1).toString().padStart(2, '0')}-${new Date(dataItem[item]).getDate().toString().padStart(2, '0')}</p>`

            if (item === 'status')
                td.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                         <span class="badge ${dataItem.status === 'responded' ? ('bg-success') : (dataItem.status === 'rejected' ? ('bg-danger') : ('bg-warning'))}"> ${dataItem.status} </span>
                    </div>
                `


            tr.appendChild(td);
        })

        tr.addEventListener('click', () => {
            window.location.href = `/admin/${dataType.innerText.toLowerCase()}/${dataItem._id}`;
        })

        table.appendChild(tr);

    });
};


const renderInquiriesData = (headerItems, data, selectedOpt) => {

    renderSelectedData(headerItems, selectedOpt);

    data.forEach(dataItem => {
        let tr = document.createElement('tr');

        headerItems.forEach(item => {
            let td = document.createElement('td');
            td.classList.add('border-bottom-0');

            if (['user', 'email', 'phoneNumber', 'job'].includes(item)) {
                if (item === 'user')
                    td.innerHTML = `<p class="fw-normal mb-0 fs-4">${dataItem['user']['name']}</p>`
                else
                    td.innerHTML = `<p class="fw-normal mb-0 fs-4">${dataItem['user'][item]}</p>`
            } else if (item === 'property') {
                td.innerHTML = `<p class="fw-normal mb-0 fs-4">${dataItem['property']['name']}</p>`
            } else if (item === 'createdAt')
                td.innerHTML = `<p class="fw-normal mb-0 fs-4">${new Date(dataItem[item]).getFullYear()}-${(new Date(dataItem[item]).getMonth() + 1).toString().padStart(2, '0')}-${new Date(dataItem[item]).getDate().toString().padStart(2, '0')}</p>`
            else if (item === 'status')
                td.innerHTML = `
                    <div class="d-flex align-items-center gap-2">
                         <span class="badge ${dataItem.status === 'resolved' ? ('bg-success') : (dataItem.status === 'rejected' ? ('bg-danger') : ('bg-warning'))}"> ${dataItem.status} </span>
                    </div>
                `

            tr.appendChild(td);
        });

        tr.addEventListener('click', () => {
            window.location.href = `/admin/${dataType.innerText.toLowerCase()}/${dataItem._id}`;
        })

        table.appendChild(tr);
    });

};


const renderSelectedData = (headerItems, selectedOpt) => {
    headerItems.forEach(item => {
        let th = document.createElement('th');
        th.classList.add('border-bottom-0');
        th.innerHTML = `<h6 class="fw-semibold mb-0">${capitalizeFirstLetter(item)}</h6>`
        header.appendChild(th);

        let option = document.createElement('option');
        option.value = item;

        if (selectedOpt && selectedOpt === item)
            option.selected = true;

        option.innerText = capitalizeFirstLetter(item);
        sorting.appendChild(option);
    });
}


sorting.addEventListener('change', () => {
    let selectedOption = sorting.options[sorting.selectedIndex].value;
    // sort curret data by selected option

    let newData = currentData.sort((a, b) => {
        if (a[selectedOption] < b[selectedOption])
            return -1;
        if (a[selectedOption] > b[selectedOption])
            return 1;
        return 0;
    });


    table.innerHTML = '';
    header.innerHTML = '';
    sorting.innerHTML = '';

    if (dataType.innerText === 'inquiries')
        renderInquiriesData(currentHeader, newData, selectedOption);
    else
        renderData(currentHeader, newData, selectedOption);
});

dataRendering();