// Переработать страницу на vue
let rubChar = "₽"

document.getElementById("modalMonthDataSave").addEventListener("click", async function () {
    let month = document.getElementById("month").value;
    document.getElementById("month").value = '';

    let year = document.getElementById("year").value;
    document.getElementById("year").value = '';

    let peoples = document.getElementById("peoples").value;
    document.getElementById("peoples").value = '';

    let rent = document.getElementById("rent").value;
    document.getElementById("rent").value = '';

    let ethernet = document.getElementById("ethernet").value;
    document.getElementById("ethernet").value = '';

    let hotwater = document.getElementById("hotwater").value;
    document.getElementById("hotwater").value = '';

    let coldwater = document.getElementById("coldwater").value;
    document.getElementById("coldwater").value = '';

    let electricity = document.getElementById("electricity").value;
    document.getElementById("electricity").value = '';

    if (month.length == 1) {
        month = "0" + month;
    }

    let monthData = {
        'id': parseInt(year + month),
        'month': parseInt(month),
        'year': parseInt(year),
        'rent': parseInt(rent),
        'peoples': parseInt(peoples),
        'ethernet': parseInt(ethernet),
        'hotwater': parseInt(hotwater),
        'coldwater': parseInt(coldwater),
        'electricity': parseInt(electricity)
    };

    let response = await fetch('/api/monthdata/add', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json;charset=utf-8'
        },
        credentials: 'include',
        body: JSON.stringify(monthData)
    });

    let result = await response;

    if (result.ok) {
        toastLaunch("success", "Успех", "", "Данные успешно добавлены!", "success")
    } else {
        toastLaunch(
            "warning", 
            "Ошибка", 
            "", 
            "Произошла ошибка при добавлении данных (HTTP-" + result.status + "). Данные не были добавлены.", 
            "danger"
        )
    }
});

// Компонент карточки обзора последнего месяца
let lastMonthData = new Vue({
    el: "#lastMonthData",
    data: {
        rubChar: rubChar,
        year: "",
        month: "",
        rent: "",
        ethernet: "",
        communals: "",
        total: "",
        id: ""
    },
    created: async function() {
        let lastMonthData;
        let lastCalcData;

        await this.$http.get('/api/monthdata/getlast').then(response => {
            lastMonthData = response.body
            console.log(lastMonthData)
        }, response => {
            toastLaunch("warning", "Ошибка", "", "Не удалось получить данные за последний месяц!", "danger")
        })
        
        await this.$http.get('/api/monthdata/getCalc', {params: {id: lastMonthData["id"]}}).then(response => {
            lastCalcData = response.body
            console.log(lastCalcData)
        }, response => {
            toastLaunch("warning", "Ошибка", "", "Не удалось получить расчёт за последний месяц!", "danger")
        })

        this.year = lastMonthData['year']
        this.month = lastMonthData['month']
        this.rent = lastMonthData['rent']
        this.ethernet = lastMonthData['ethernet']
        this.communals = lastCalcData["coldwater"] + lastCalcData["hotwater"] + lastCalcData["electricity"] + lastCalcData["drainage"];
        this.total = this.communals + lastMonthData["rent"] + lastMonthData["ethernet"];
        this.id = lastMonthData['id']
    },
    methods: {
        goDetail: function () {
            window.location.href = "/dashboard/list/detail?id=" + this.id
        }
    },
    template: 
    '<div class="card shadow-lg">'+
        '<div class="card-header">Расчёты</div>'+

        '<div class="card-body placeholder-glow">'+
            '<h6 class="card-subtitle mb-2 text-muted">Последний расчёт : 10.{{month}}.{{year}}</h6>'+
            '<p class="card-text">'+
                'Рента: {{rent}}{{rubChar}}<br>'+
                'Интернет: {{ethernet}}{{rubChar}}<br>'+
                'Коммунальные платежи: {{communals}}{{rubChar}}<br>'+
                'Всего: {{total}}{{rubChar}}<br>'+
           '</p>'+

            '<a v-on:click="goDetail" class="btn btn-outline-primary">Подробная информация</a>'+
            '<br>'+
            '<a href="/dashboard/list" class="card-link">Другие отчёты</a>'+
        '</div>'+
    '</div>'
})

// Компонент модала добавления новых тарифов
let modalAddTariffs = new Vue({
    el: '#addTariffsModule',
    data: {
        tariffs: {
            'id': null,
            'year': null,
            'halffOfYear': null,
            'hotwater': null,
            'coldwater': null,
            'electricity': null,
            'drainage': null
        }  
    },
    methods: {
        addNewTariff: async function () {   
            this.tariffs['id'] = parseInt(this.tariffs['year'] + this.tariffs['halffOfYear'])
            
            let response = await fetch('api/tariffs/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include',
                body: JSON.stringify(this.tariffs)
            });
        
            let result = await response;
        
            if (result.ok) {
                toastLaunch("success", "Успех", "", "Тарифы ушпешно обновлены!", "success")

                this.tariffs['year'] = null
                this.tariffs['halffOfYear'] = null
                this.tariffs['hotwater'] = null
                this.tariffs['coldwater'] = null
                this.tariffs['electricity'] = null
                this.tariffs['drainage'] = null
            } else {
                toastLaunch(
                    "warning", 
                    "Ошибка", 
                    "", 
                    "Произошла ошибка при добавлении данных (HTTP-" + result.status + "). Данные не были обновлены.", 
                    "danger"
                )
            }
        }
    },
    template: 
    '<div class="modal-content">'+
        '<div class="modal-header">'+
            '<h5 class="modal-title" id="ModalAddTariffsLabel">Обновить данные по тарифам</h5>'+
            '<button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>'+
        '</div>'+

        '<div class="modal-body">'+
            '<form id="modalAddTariffsForm">'+
                '<div class="mb-3">'+
                    '<label for="yearTariff" class="form-label">Год</label>'+
                    '<input v-model="tariffs[\'year\']" type="number" class="form-control" id="yearTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="halfTariff" class="form-label">Половина года (1/2 - первая/вторая)</label>'+
                    '<input v-model="tariffs[\'halffOfYear\']" type="number" class="form-control" id="halfTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="hotwaterTariff" class="form-label">Горячая вода</label>'+
                    '<input v-model="tariffs[\'hotwater\']" type="number" class="form-control" id="hotwaterTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="coldwaterTariff" class="form-label">Холодная вода</label>'+
                    '<input v-model="tariffs[\'coldwater\']" type="number" class="form-control" id="coldwaterTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="electricityTariff" class="form-label">Электричество</label>'+
                    '<input v-model="tariffs[\'electricity\']" type="number" class="form-control" id="electricityTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="drainageTariff" class="form-label">Водоотведение</label>'+
                    '<input v-model="tariffs[\'drainage\']" type="number" class="form-control" id="drainageTariff">'+
                '</div>'+
            '</form>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Отмена</button>'+
            '<button v-on:click="addNewTariff" type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modalTariffsSave">Сохранить</button>'+
        '</div>'+
    '</div>'
})
