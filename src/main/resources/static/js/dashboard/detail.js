let rubChar = "₽"
let monthId;
let lastMonthData;
let prevMonthData;
let lastCalcData;
let prevCalcData;
let tariffsData;

function initCharts() { 
    const communalsLabels = [
        'Горячая вода',
        'Холодная вода',
        'Электричество',
        'Водоотведение',
    ];
    const communalsData = {
        labels: communalsLabels,
        datasets: [{
            label: 'Платежи по категориям',
            backgroundColor: [
                'rgb(232, 66, 44)',
                'rgb(97, 192, 255)',
                'rgb(224, 240, 122)',
                'rgb(160, 110, 49)',
            ],
            data: [
                lastCalcData['hotwater'], 
                lastCalcData['coldwater'], 
                lastCalcData['electricity'], 
                lastCalcData['drainage']
            ],
        }]
    };
    const communalsConfig = {
        type: 'pie',
        data: communalsData,
        options: {}
    };
    
    const communalsChart = new Chart(
        document.getElementById('communals'),
        communalsConfig
    );
}

Vue.component('overview-card-row', {
    props: ['title', 'text', 'textEnding'],
    template: 
    '<p class="lead row">'+
        '<span class="col-9">{{title}}</span>'+
        '<span class="badge bg-primary col-3">{{text}}{{textEnding}}</span>'+
    '</p>'
})

Vue.component('overview-card', {
    props: ['header', 'cardData'],
    template: 
        '<div class="col-6">'+
            '<div class="card shadow-lg" style="height:100%">'+
                '<div class="card-header">{{header}}</div>'+
                '<div class="card-body placeholder-glow">'+
                    '<overview-card-row v-for="rowData in cardData" :title="rowData[\'title\']" :text="rowData[\'text\']" :textEnding="rowData[\'textEnding\']" :key="rowData[\'title\']"/>'+
                    //'<overview-card-row title="Заголовок" text="23442" textEnding="р." />'+
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
                alert("Не удалось получить данные за прошлый месяц!")
            })
    
            await This.$http.get('/api/monthdata/getPrev', {params: {id: lastMonthData["id"]}}).then(response => {
                prevMonthData = response.body
                console.log(prevMonthData)
            }, response => {
                alert("Не удалось получить данные за позапрошлый месяц!")
            })
    
            await This.$http.get('/api/monthdata/getCalc', {params: {id: lastMonthData["id"]}}).then(response => {
                lastCalcData = response.body
                console.log(lastCalcData)
            }, response => {
                alert("Не удалось получить расчёт за прошлый месяц!")
            })
    
            await This.$http.get('/api/monthdata/getCalc', {params: {id: prevMonthData["id"]}}).then(response => {
                prevCalcData = response.body
                console.log(prevCalcData)
            }, response => {
                alert("Не удалось получить расчёт за позапрошлый месяц!")
            })
    
            await This.$http.get(
                '/api/tariffs/getByDate',
                { params: { year: lastMonthData["year"], month: lastMonthData["month"] } })
                .then(response => {
                    tariffsData = response.body
                    console.log(tariffsData)
                }, response => {
                    alert("Не удалось получить тарифы!")
                })
        }(this));

        console.log("Данные загружены!")

        let totalCommunal = lastCalcData["coldwater"] + lastCalcData["hotwater"] + lastCalcData["electricity"] + lastCalcData["drainage"];
        let total = totalCommunal + lastMonthData["rent"] + lastMonthData["ethernet"];

        console.log(totalCommunal)
        console.log(total)

        this.mainCardData.push({
            'title': "Сумма за месяц (с интернетом):",
            'text': total.toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "Сумма за месяц (без интернета):",
            'text': (total - lastMonthData['ethernet']).toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "Из этого коммунальные услуги:",
            'text': totalCommunal.toFixed(2),
            'textEnding': rubChar
        })
        this.mainCardData.push({
            'title': "На каждого платящего:",
            'text': (total / lastMonthData["peoples"]).toFixed(2),
            'textEnding': rubChar
        })


        this.noncalcCardData.push({
            'title': "Рента:",
            'text': lastMonthData['rent'],
            'textEnding': rubChar
        })
        this.noncalcCardData.push({
            'title': "Стоимость интернета:",
            'text': lastMonthData['ethernet'],
            'textEnding': rubChar
        })
        this.noncalcCardData.push({
            'title': "Количество плательщиков:",
            'text': lastMonthData['peoples'],
            'textEnding': ''
        })


        this.communalCardData.push({
            'title': "Электричество:",
            'text': lastCalcData['electricity'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Горячая вода:",
            'text': lastCalcData['hotwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Холодная вода:",
            'text': lastCalcData['coldwater'].toFixed(2),
            'textEnding': rubChar
        })
        this.communalCardData.push({
            'title': "Водоотведение:",
            'text': lastCalcData['drainage'].toFixed(2),
            'textEnding': rubChar
        })


        this.countersCardData.push({
            'title': "Электричество:",
            'text': lastMonthData['electricity'] + "(" + (lastMonthData['electricity'] - prevMonthData['electricity']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Горячая вода:",
            'text': lastMonthData['hotwater'] + "(" + (lastMonthData['hotwater'] - prevMonthData['hotwater']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Холодная вода:",
            'text': lastMonthData['coldwater'] + "(" + (lastMonthData['coldwater'] - prevMonthData['coldwater']) + ")",
            'textEnding': ''
        })
        this.countersCardData.push({
            'title': "Водоотведение:",
            'text': (lastMonthData['hotwater'] - prevMonthData['hotwater']) + (lastMonthData['coldwater'] - prevMonthData['coldwater']),
            'textEnding': ''
        })


        this.tariffsCardData.push({
            'title': "Электричество:",
            'text': tariffsData['electricity'],
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Горячая вода:",
            'text': tariffsData['hotwater'],
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Холодная вода:",
            'text': tariffsData['coldwater'],
            'textEnding': rubChar
        })
        this.tariffsCardData.push({
            'title': "Водоотведение:",
            'text': tariffsData['drainage'],
            'textEnding': rubChar
        })
        
        initCharts()
    },
    template: 
        '<div class="container">'+
            '<div class="row p-5">'+
                '<overview-card header="Главные цифры" :cardData="this.mainCardData"/>'+
                '<overview-card header="Нерасчётные значения" :cardData="this.noncalcCardData"/>'+
            '</div>'+

            '<div class="row p-5">'+
                '<overview-card header="Коммунальные платежи" :cardData="this.communalCardData"/>'+
                '<overview-card header="Счётчики" :cardData="this.countersCardData"/>'+
            '</div>'+

            '<div class="row p-5">'+
                '<overview-card header="Тарифы" :cardData="this.tariffsCardData"/>'+
                '<div class="col-6">'+
                    '<div class="card shadow-lg">'+
                        '<div class="card-header">'+
                            'Доступные действия'+
                        '</div>'+
                        '<ul class="list-group list-group-flush placeholder-glow">'+
                            '<li class="list-group-item">'+
                                '<a href="404" class="card-link">Сформировать отчёт</a>'+
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