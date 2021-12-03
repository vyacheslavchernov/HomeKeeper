let rubChar = "₽"
let monthId;

let lastMonthData;
let prevMonthData;
let prevPrevMonthData;

let lastCalcData;
let prevCalcData;

let tariffsData;

let total;
let prevTotal;
let totalCommunal
let prevTotalCommunal

function initCharts() { 
    // Communal chart
    const communalChartLabels = [
        'Горячая вода',
        'Холодная вода',
        'Электричество',
        'Водоотведение',
    ];
    const communalChartData = {
        labels: communalChartLabels,
        datasets: [
            {
                label: 'Текущий месяц',
                backgroundColor: 'rgb(99, 242, 192)',
                data: [
                    lastCalcData['hotwater'], 
                    lastCalcData['coldwater'], 
                    lastCalcData['electricity'], 
                    lastCalcData['drainage']
                ],
            },
            {
                label: 'Прошлый месяц',
                backgroundColor: 'rgb(80, 198, 241)',
                data: [
                    prevCalcData['hotwater'], 
                    prevCalcData['coldwater'], 
                    prevCalcData['electricity'], 
                    prevCalcData['drainage']
                ],
            }
        ]
    };
    const communalChartConfig = {
        type: 'bar',
        data: communalChartData,
        options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Сравнение сумм коммунальных платежей'
              }
            }
          }
    };
    const communalChart = new Chart(
        document.getElementById('communals'),
        communalChartConfig
    );

    // Counters chart
    const countersChartLabels = [
        'Горячая вода',
        'Холодная вода',
        'Электричество',
        'Водоотведение',
    ];
    const countersChartData = {
        labels: countersChartLabels,
        datasets: [
            {
                label: 'Текущий месяц',
                backgroundColor: 'rgb(99, 242, 192)',
                data: [
                    lastMonthData['hotwater'] - prevMonthData['hotwater'], 
                    lastMonthData['coldwater']  - prevMonthData['coldwater'], 
                    lastMonthData['electricity']  - prevMonthData['electricity'], 
                    (lastMonthData['hotwater'] - prevMonthData['hotwater']) + (lastMonthData['coldwater']  - prevMonthData['coldwater'])
                ],
            },
            {
                label: 'Прошлый месяц',
                backgroundColor: 'rgb(80, 198, 241)',
                data: [
                    prevMonthData['hotwater'] - prevPrevMonthData['hotwater'], 
                    prevMonthData['coldwater'] - prevPrevMonthData['coldwater'], 
                    prevMonthData['electricity'] - prevPrevMonthData['electricity'], 
                    (prevMonthData['hotwater'] - prevPrevMonthData['hotwater']) + (prevMonthData['coldwater'] - prevPrevMonthData['coldwater'])
                ],
            }
        ]
    };
    const countersChartConfig = {
        type: 'bar',
        data: countersChartData,
        options: {
            responsive: true,
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Сравнение потребления'
              }
            }
          }
    };
    const countersChart = new Chart(
        document.getElementById('counters'),
        countersChartConfig
    );

     // Total sum chart
     const totalChartLabels = [
        'Сумма за месяц (с интернетом)',
        'Сумма за месяц (без интернета)'
    ];
    const totalChartData = {
        labels: totalChartLabels,
        datasets: [
            {
                label: 'Текущий месяц',
                backgroundColor: 'rgb(99, 242, 192)',
                data: [
                    total,
                    total - lastMonthData['ethernet']
                ],
            },
            {
                label: 'Прошлый месяц',
                backgroundColor: 'rgb(80, 198, 241)',
                data: [
                    prevTotal,
                    prevTotal - prevMonthData['ethernet']
                ],
            }
        ]
    };
    const totalChartConfig = {
        type: 'bar',
        data: totalChartData,
        options: {
            responsive: true,
            indexAxis: 'y',
            plugins: {
              legend: {
                position: 'top',
              },
              title: {
                display: true,
                text: 'Сравнение общих сумм'
              }
            }
          }
    };
    const totalChart = new Chart(
        document.getElementById('total'),
        totalChartConfig
    );
}

Vue.component('overview-card-row', {
    props: ['title', 'text', 'textEnding'],
    template: 
    '<p class="lead row ps-2 pe-2">'+
        '<span class="col-xl-9">{{title}}</span>'+
        '<span class="badge bg-light text-dark col-xl-3">{{text}}{{textEnding}}</span>'+
    '</p>'
})

Vue.component('overview-card', {
    props: ['header', 'cardData'],
    template: 
        '<div class="col-xl-6 mt-3">'+
            '<div class="card shadow-lg" style="height:100%">'+
                '<div class="card-header">{{header}}</div>'+
                '<div class="card-body placeholder-glow">'+
                    '<overview-card-row v-for="rowData in cardData" :title="rowData[\'title\']" :text="rowData[\'text\']" :textEnding="rowData[\'textEnding\']" :key="rowData[\'title\']"/>'+
                '</div>'+
            '</div>'+
        '</div>'
})

let monthOverview = new Vue({
    el: '#month-overview',
    data: {
        mainCardData: [],
        noncalcCardData: [],
        communalCardData: [],
        countersCardData: [],
        tariffsCardData: []
    },
    created: async function() {
        let url_string = window.location.href
        let url = new URL(url_string);
        monthId = url.searchParams.get("id");

        await (async function(This) {
            await This.$http.get('/api/monthdata/get', {params: {id: monthId}}).then(response => {
                lastMonthData = response.body
                console.log(lastMonthData)
            }, response => {
                toastLaunch("warning", "Ошибка", "", "Не удалось получить данные за текущий месяц!", "danger")
            })
    
            document.getElementById("loadProgress").setAttribute("style", "width:"+ 16 +"%")
            await This.$http.get('/api/monthdata/getPrev', {params: {id: lastMonthData["id"]}}).then(response => {
                prevMonthData = response.body
                console.log(prevMonthData)
            }, response => {
                toastLaunch("warning", "Ошибка", "", "Не удалось получить данные за прошлый месяц!", "danger")
            })

            document.getElementById("loadProgress").setAttribute("style", "width:"+ 16*2 +"%")
            await This.$http.get('/api/monthdata/getPrev', {params: {id: prevMonthData["id"]}}).then(response => {
                prevPrevMonthData = response.body
                console.log(prevPrevMonthData)
            }, response => {
                toastLaunch("warning", "Ошибка", "", "Не удалось получить данные за позапрошлый месяц!", "danger")
            })
    
            document.getElementById("loadProgress").setAttribute("style", "width:"+ 16*3 +"%")
            await This.$http.get('/api/monthdata/getCalc', {params: {id: lastMonthData["id"]}}).then(response => {
                lastCalcData = response.body
                console.log(lastCalcData)
            }, response => {
                toastLaunch("warning", "Ошибка", "", "Не удалось получить расчёт за текущий месяц!", "danger")
            })
    
            document.getElementById("loadProgress").setAttribute("style", "width:"+ 16*4 +"%")
            await This.$http.get('/api/monthdata/getCalc', {params: {id: prevMonthData["id"]}}).then(response => {
                prevCalcData = response.body
                console.log(prevCalcData)
            }, response => {
                toastLaunch("warning", "Ошибка", "", "Не удалось получить расчёт за прошлый месяц!", "danger")
            })
    
            document.getElementById("loadProgress").setAttribute("style", "width:"+ 16*5 +"%")
            await This.$http.get(
                '/api/tariffs/getByDate',
                { params: { year: lastMonthData["year"], month: lastMonthData["month"] } })
                .then(response => {
                    tariffsData = response.body
                    console.log(tariffsData)
                }, response => {
                    toastLaunch("warning", "Ошибка", "", "Не удалось получить тарифы!", "danger")
                })
        }(this));

        document.getElementById("loadProgress").setAttribute("style", "width:"+ 16*6 +"%")
        console.log("Данные загружены!")

        totalCommunal = lastCalcData["coldwater"] + lastCalcData["hotwater"] + lastCalcData["electricity"] + lastCalcData["drainage"];
        prevTotalCommunal = prevCalcData["coldwater"] + prevCalcData["hotwater"] + prevCalcData["electricity"] + prevCalcData["drainage"];

        total = totalCommunal + lastMonthData["rent"] + lastMonthData["ethernet"];
        prevTotal = prevTotalCommunal + prevMonthData["rent"] + prevMonthData["ethernet"];

        console.log(totalCommunal)
        console.log(total)

        this.mainCardData.push({
            'title': "Сумма за месяц (с интернетом)",
            'text': total.toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "Сумма за месяц (без интернета)",
            'text': (total - lastMonthData['ethernet']).toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "Из этого коммунальные услуги",
            'text': totalCommunal.toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "На каждого платящего",
            'text': (total / lastMonthData["peoples"]).toFixed(2),
            'textEnding': rubChar
        })


        this.noncalcCardData.push({
            'title': "Рента",
            'text': lastMonthData['rent'],
            'textEnding': rubChar
        })
        this.noncalcCardData.push({
            'title': "Стоимость интернета",
            'text': lastMonthData['ethernet'],
            'textEnding': rubChar
        })
        this.noncalcCardData.push({
            'title': "Количество плательщиков",
            'text': lastMonthData['peoples'],
            'textEnding': ''
        })


        this.communalCardData.push({
            'title': "Электричество",
            'text': lastCalcData['electricity'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Горячая вода",
            'text': lastCalcData['hotwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Холодная вода",
            'text': lastCalcData['coldwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Водоотведение",
            'text': lastCalcData['drainage'].toFixed(2),
            'textEnding': rubChar
        })


        this.countersCardData.push({
            'title': "Электричество",
            'text': lastMonthData['electricity'] + "(" + (lastMonthData['electricity'] - prevMonthData['electricity']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Горячая вода",
            'text': lastMonthData['hotwater'] + "(" + (lastMonthData['hotwater'] - prevMonthData['hotwater']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Холодная вода",
            'text': lastMonthData['coldwater'] + "(" + (lastMonthData['coldwater'] - prevMonthData['coldwater']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Водоотведение",
            'text': (lastMonthData['hotwater'] - prevMonthData['hotwater']) + (lastMonthData['coldwater'] - prevMonthData['coldwater']),
            'textEnding': ''
        })


        this.tariffsCardData.push({
            'title': "Электричество",
            'text': tariffsData['electricity'].toFixed(2),
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Горячая вода",
            'text': tariffsData['hotwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Холодная вода",
            'text': tariffsData['coldwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Водоотведение",
            'text': tariffsData['drainage'].toFixed(2),
            'textEnding': rubChar
        })
        
        document.getElementById("loadSplash").setAttribute("class", "d-none")

        initCharts()

        const modalBill = new Vue({
            el: "#modalBillComponent",
            data: {
                lastCalcData: lastCalcData,
                lastMonthData: lastMonthData,
                totalCommunal: totalCommunal
            },
            template: 
            '<div class="modal-body">'+
                'Электроэнергия - {{lastCalcData["electricity"].toFixed(2)}}₽<br/>'+
                'Горячая вода - {{lastCalcData["hotwater"].toFixed(2)}}₽<br/>'+
                'Холодная вода - {{lastCalcData["coldwater"].toFixed(2)}}₽<br/>'+
                'Водоотведение - {{lastCalcData["drainage"].toFixed(2)}}₽<br/><br/>'+

                'Сумма - {{totalCommunal.toFixed(2)}}₽<br/><br/>'+

                'Итог - {{lastMonthData["rent"].toFixed(2)}}₽ + {{totalCommunal.toFixed(2)}}₽ = {{ (lastMonthData["rent"] + totalCommunal).toFixed(2) }}₽'+
            '</div>'
        })
    },
    template: 
        '<div class="container-xl mt-xl-5">'+
            '<div class="row ps-xl-5 pe-xl-5">'+
                '<overview-card header="Главные цифры" :cardData="this.mainCardData"/>'+
                '<overview-card header="Нерасчётные значения" :cardData="this.noncalcCardData"/>'+
            '</div>'+

            '<div class="row ps-xl-5 pe-xl-5">'+
                '<overview-card header="Коммунальные платежи" :cardData="this.communalCardData"/>'+
                '<overview-card header="Счётчики" :cardData="this.countersCardData"/>'+
            '</div>'+

            '<div class="row ps-xl-5 pe-xl-5">'+
                '<overview-card header="Тарифы" :cardData="this.tariffsCardData"/>'+
                '<div class="col-xl-6 mt-3">'+
                    '<div class="card shadow-lg" style="width:100%;">'+
                        '<div class="card-header">'+
                            'Доступные действия'+
                        '</div>'+
                        '<ul class="list-group list-group-flush placeholder-glow">'+
                            '<li class="list-group-item">'+
                                '<a href="" data-bs-toggle="modal" data-bs-target="#ModalBill" class="card-link">Сформировать отчёт</a>'+
                            '</li>'+
    
                            '<li class="list-group-item">'+
                            '<a href="404" class="card-link">Сравнить с другим месяцем</a>'+
                            '</li>'+
                        '</ul>'+
                    '</div>'+
                '</div>'+
            '</div>'+
        '</div>'
})