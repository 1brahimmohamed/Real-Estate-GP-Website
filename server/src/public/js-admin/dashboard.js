/** ---------------------------------------- CHARTS ---------------------------------------- **/

let selector = document.getElementById('selection-id').value;
let charts = [1, 2, 3];
let titleOfChart = document.getElementById('chart1-id');


let inquiriesTable = document.getElementById('inquiry-rows');
let messagesTable = document.getElementById('messages-ul');

$(async function () {
    selector = document.getElementById('selection-id').value;
    let propertyStats = await requestPropertyStatsData(selector);
    firstChart(propertyStats);
    secondChart();
    thirdChart();
    viewInquiries();
    viewMessages();
})

const requestPropertyStatsData = async () => {
    let propertyStats = {};

    let res = await fetch(`api/v1/properties/propertyStats/${selector}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    let resp = await res.json();
    return resp.data.stats;
};

const getUsersData = async () => {

    let res = await fetch(`api/v1/users/getUserStats/job`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json'
        },
    })
    let resp = await res.json();

    return [resp.usersCount, resp.data.stats];
};

const extractData = (propertyStats) => {
    // get _ids , maxPrice, MinPrice from propertyStats
    let ids = [];
    let maxPrice = [];
    let minPrice = [];

    propertyStats.forEach(property => {
        ids.push(property._id);
        maxPrice.push(property.maxPrice);
        minPrice.push(property.minPrice);
    });

    let maxPriceOfProperty = Math.max(...maxPrice);

    return {ids, maxPrice, minPrice, maxPriceOfProperty};
};

const firstChart = async (propertyStats) => {

    let {ids, maxPrice, minPrice, maxPriceOfProperty} = extractData(propertyStats);

    // =====================================
    // Profit
    // =====================================
    var chart = {
        series: [
            {name: `Max Price`, data: maxPrice},
            {name: `Min Price`, data: minPrice},
        ],

        chart: {
            type: "bar",
            height: 345,
            offsetX: -15,
            toolbar: {show: true},
            foreColor: "#adb0bb",
            fontFamily: 'inherit',
            sparkline: {enabled: false},
        },


        colors: ["#970001", "#570000"],


        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: "35%",
                borderRadius: [6],
                borderRadiusApplication: 'end',
                borderRadiusWhenStacked: 'all'
            },
        },
        markers: {size: 0},

        dataLabels: {
            enabled: false,
        },


        legend: {
            show: false,
        },


        grid: {
            borderColor: "rgba(0,0,0,0.1)",
            strokeDashArray: 3,
            xaxis: {
                lines: {
                    show: false,
                },
            },
        },

        xaxis: {
            type: "category",
            categories: ids,
            labels: {
                style: {cssClass: "grey--text lighten-2--text fill-color"},
            },
        },


        yaxis: {
            show: true,
            min: 0,
            max: maxPriceOfProperty + 1000000,
            tickAmount: 4,
            labels: {
                style: {
                    cssClass: "grey--text lighten-2--text fill-color",
                },
            },
        },
        stroke: {
            show: true,
            width: 3,
            lineCap: "butt",
            colors: ["transparent"],
        },


        tooltip: {theme: "light"},

        responsive: [
            {
                breakpoint: 600,
                options: {
                    plotOptions: {
                        bar: {
                            borderRadius: 3,
                        }
                    },
                }
            }
        ]


    };


    titleOfChart.innerText = `Prices Overview by ${selector.charAt(0).toUpperCase() + selector.slice(1)}`;
    var chart = new ApexCharts(document.querySelector("#chart"), chart);
    charts[1] = chart;
    chart.render();
};

const updateFirstChart = async (propertyStats) => {

    let {ids, maxPrice, minPrice, maxPriceOfProperty} = extractData(propertyStats);

    await charts[1].updateSeries([
        {name: `Max Price`, data: maxPrice},
        {name: `Min Price`, data: minPrice},
    ]);

    charts[1].updateOptions({
        xaxis: {
            categories: ids,
        },
        yaxis: {
            max: maxPriceOfProperty + 1000000,
        }
    });
};

const secondChart = async () => {


    let userData = await getUsersData();
    // remove first element from userData array

    const filteredStats = userData[1].filter(obj => obj._id !== null);

    let series = filteredStats.map(user => user.numUsers);
    let categories = filteredStats.map(user => user._id);


    var breakup = {
        color: "#adb5bd",
        series: series,
        labels: categories,
        chart: {
            width: 180,
            type: "donut",
            fontFamily: "Plus Jakarta Sans', sans-serif",
            foreColor: "#adb0bb",
        },
        plotOptions: {
            pie: {
                startAngle: 0,
                endAngle: 360,
                donut: {
                    size: '75%',
                },
            },
        },
        stroke: {
            show: false,
        },

        dataLabels: {
            enabled: false,
        },

        legend: {
            show: false,
        },
        colors: ["#d96b6b", "#570000", "#c9c0c0"],

        responsive: [
            {
                breakpoint: 991,
                options: {
                    chart: {
                        width: 150,
                    },
                },
            },
        ],
        tooltip: {
            theme: "dark",
            fillSeriesColor: false,
        },
    };

    var chart = new ApexCharts(document.querySelector("#breakup"), breakup);
    charts[2] = chart;

    let count = document.getElementById('users-count');
    count.innerText = userData[0] + ' Users'
    chart.render();
};

const thirdChart = async () => {
    var earning = {
        chart: {
            id: "sparkline3",
            type: "area",
            height: 60,
            sparkline: {
                enabled: true,
            },
            group: "sparklines",
            fontFamily: "Plus Jakarta Sans', sans-serif",
            foreColor: "#adb0bb",
        },
        series: [
            {
                name: "Earnings",
                color: "#970001",
                data: [25, 66, 20, 40, 12, 58, 20],
            },
        ],
        stroke: {
            curve: "smooth",
            width: 2,
        },
        fill: {
            colors: ["#f3feff"],
            type: "solid",
            opacity: 0.05,
        },

        markers: {
            size: 0,
        },
        tooltip: {
            theme: "dark",
            fixed: {
                enabled: true,
                position: "right",
            },
            x: {
                show: false,
            },
        },
    };
    let chart = new ApexCharts(document.querySelector("#earning"), earning)
    charts[3] = chart;
    chart.render();
};

document.getElementById('selection-id').addEventListener('change', async function () {
    selector = document.getElementById('selection-id').value;
    let propertyStats = await requestPropertyStatsData(selector);
    await updateFirstChart(propertyStats);
    titleOfChart.innerText = `Prices Overview by ${selector.charAt(0).toUpperCase() + selector.slice(1)}`;
});

/** ****************************** Messages ********************************* */

const getMessages = async () => {
    let res = await fetch('/api/v1/messages', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    return res.data.messages;
};

const viewMessages = async () => {

    let messages = await getMessages();

    for (let i = 0; i < 5; i++) {
        let date = new Date(messages[i].createdAt);

        let container = document.createElement('li');
        container.classList.add('timeline-item', 'd-flex', 'position-relative', 'overflow-hidden');
        container.innerHTML = `

                    <div class="timeline-time text-dark flex-shrink-0 text-end">${date.getUTCHours().toString().padStart(2, '0')}:${ date.getUTCMinutes().toString().padStart(2, '0')}</div>
                    <div class="timeline-badge-wrap d-flex flex-column align-items-center">
                      <span class="timeline-badge border-2 border ${messages[i].status === 'pending'? ('border-warning'):(messages[i].status === 'responded'? ('border-success'):('border-danger'))} flex-shrink-0 my-8"></span>
                      <span class="timeline-badge-border d-block flex-shrink-0"></span>
                    </div>
                    <div class="timeline-desc fs-3 text-dark mt-n1 fw-semibold">${messages[i].email}
                    <a href="javascript:void(0)" class="text-primary d-block fw-normal">${messages[i].subject}</a>
                    </a>
                    </div>
                
        `;
        messagesTable.appendChild(container);
    }
}


/** ****************************** Inquiries ********************************* */

const getInquiries = async () => {
    let res = await fetch('/api/v1/inquiries', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        }
    }).then(res => res.json());

    return res.data.inquiries;
}

const viewInquiries = async () => {

    let inquiries = await getInquiries();

    for (let i = 0; i < 4; i++) {
        let container = document.createElement('tr')
        container.innerHTML = `

            <td class="border-bottom-0" >
                <h6 class= "fw-semibold mb-1" >${inquiries[i].user.name}</h6>
                <span class="fw-normal">${inquiries[i].user.job}</span>
            </td>

            <td class="border-bottom-0">
                <h6 class="mb-0 fw-semibold">${inquiries[i].property.name}</h6>
            </td>
    
            <td class="border-bottom-0">
                <p class="fw-normal mb-0 fs-4">${inquiries[i].property._id}</p>
            </td>
    
            <td class="border-bottom-0">
                <div class="d-flex align-items-center gap-2">
                    <span class="badge bg-primary ${inquiries[i].status === 'pending'? ('bg-warning'):(inquiries[i].status === 'resolved'?'bg-success':'bg-danger')} fw-semibold">${inquiries[i].status}</span>
                </div>
            </td>
            
            `;
        inquiriesTable.appendChild(container);
    }
};

