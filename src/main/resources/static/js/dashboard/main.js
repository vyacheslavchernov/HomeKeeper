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

window.onload = async function () {
    let response = await fetch('/api/monthdata/getlast', {
        method: 'GET',
        credentials: 'include'
    });

    let responce = await response;
    let lastMonth;
    let calcData;

    if (responce.ok) {
        lastMonth = await response.json();
        console.log(lastMonth)

        document.getElementById("lastMonthShortReportTitle").innerHTML = "Последний расчёт 10." + lastMonth["month"] + "." + lastMonth["year"] + ":";
        document.getElementById("checkDetailReport").setAttribute("href", "/dashboard/list/detail?id=" + lastMonth['id'])

        response = await fetch('/api/monthdata/getCalc?id=' + lastMonth["id"], {
            method: 'GET',
            credentials: 'include'
        });

        if (responce.ok) {
            try { calcData = await response.json() } catch { window.location.href = "/error" };
            console.log(calcData)

            let totalCommunal = calcData["coldwater"] + calcData["hotwater"] + calcData["electricity"] + calcData["drainage"];
            let total = totalCommunal + lastMonth["rent"] + lastMonth["ethernet"];

            document.getElementById("lastMonthShortReportBody").innerHTML =
                "Рента: <i>" + lastMonth["rent"].toFixed(2) + "</i> руб. <br>" +
                "Интернет: <i>" + lastMonth["ethernet"].toFixed(2) + "</i> руб. <br>" +
                "Коммунальные платежи: <i>" + totalCommunal.toFixed(2) + "</i> руб. <br>" +
                "Всего: <i>" + total.toFixed(2) + "</i> руб. <br>"
        } else {
            alert("Произошла ошибка при расчёте последнего месяца(" + responce.status + "). Данные не были получены.")
        }
    } else {
        alert("Произошла ошибка при загрузке данных последнего месяца(" + responce.status + "). Данные не были загружены.")
    }
}

function toastLaunch(icon, largeHeader, smallHeader, text, color) {
    let id = "toast" + Date.now()
    document.getElementById("toastContainer").innerHTML += toastBuilder(
        icon, 
        largeHeader, 
        smallHeader, 
        text, 
        id,
        color
    )
    new bootstrap.Toast(document.getElementById(id)).show()
}

function toastBuilder(icon, largeHeader, smallHeader, text, id, color) {

    let toastColors = {
        "primary": "text-white bg-primary",
        "success": "text-white bg-success",
        "danger": "text-white bg-danger"
    }

    let toastIcons = {
        "success" : '<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-check-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M10.97 4.97a.235.235 0 0 0-.02.022L7.477 9.417 5.384 7.323a.75.75 0 0 0-1.06 1.06L6.97 11.03a.75.75 0 0 0 1.079-.02l3.992-4.99a.75.75 0 0 0-1.071-1.05z"/></svg>',
        "warning" : '<svg class="me-2" xmlns="http://www.w3.org/2000/svg" width="16" height="16" fill="currentColor" class="bi bi-exclamation-circle" viewBox="0 0 16 16"><path d="M8 15A7 7 0 1 1 8 1a7 7 0 0 1 0 14zm0 1A8 8 0 1 0 8 0a8 8 0 0 0 0 16z"/><path d="M7.002 11a1 1 0 1 1 2 0 1 1 0 0 1-2 0zM7.1 4.995a.905.905 0 1 1 1.8 0l-.35 3.507a.552.552 0 0 1-1.1 0L7.1 4.995z"/></svg>',
        "none" : ""
    }

    return (
        '<div class="toast mt-2 ' + toastColors[color] +'" role="alert" aria-live="assertive" aria-atomic="true" id="' + id + '">' +
            '<div class="toast-header">' +
                toastIcons[icon]+
                '<strong class="me-auto">' + largeHeader + '</strong>' +
                '<small>' + smallHeader + '</small>' +
                '<button type="button" class="btn-close" data-bs-dismiss="toast" aria-label="Закрыть"></button>' +
            '</div>' +
            '<div class="toast-body">' +
                text +
            '</div>' +
        '</div>')
}

let modalAddTariffs = new Vue({
    el: '#addTariffsModule',
    data: {
        year: null,
        half: null,
        hotwater: null,
        coldwater: null,
        electricity: null,
        drainage: null
    },
    methods: {
        addNewTariff: async function () {

            let tariffs = {
                'id': parseInt(this.year + this.half),
                'halffOfYear': this.half,
                'year': this.year,
                'hotwater': this.hotwater,
                'coldwater': this.coldwater,
                'electricity': this.electricity,
                'drainage': this.drainage
            };

            this.year = null
            this.half = null
            this.hotwater = null
            this.coldwater = null
            this.electricity = null
            this.drainage = null
        
            let response = await fetch('api/tariffs/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json;charset=utf-8'
                },
                credentials: 'include',
                body: JSON.stringify(tariffs)
            });
        
            let result = await response;
        
            if (result.ok) {
                toastLaunch("success", "Успех", "", "Тарифы ушпешно обновлены!", "success")
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
                    '<input v-model="year" type="number" class="form-control" id="yearTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="halfTariff" class="form-label">Половина года (1/2 - первая/вторая)</label>'+
                    '<input v-model="half" type="number" class="form-control" id="halfTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="hotwaterTariff" class="form-label">Горячая вода</label>'+
                    '<input v-model="hotwater" type="number" class="form-control" id="hotwaterTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="coldwaterTariff" class="form-label">Холодная вода</label>'+
                    '<input v-model="coldwater" type="number" class="form-control" id="coldwaterTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="electricityTariff" class="form-label">Электричество</label>'+
                    '<input v-model="electricity" type="number" class="form-control" id="electricityTariff">'+
                '</div>'+

                '<div class="mb-3">'+
                    '<label for="drainageTariff" class="form-label">Водоотведение</label>'+
                    '<input v-model="drainage" type="number" class="form-control" id="drainageTariff">'+
                '</div>'+
            '</form>'+
        '</div>'+

        '<div class="modal-footer">'+
            '<button type="button" class="btn btn-outline-danger" data-bs-dismiss="modal">Отмена</button>'+
            '<button v-on:click="addNewTariff" type="button" class="btn btn-primary" data-bs-dismiss="modal" id="modalTariffsSave">Сохранить</button>'+
        '</div>'+
    '</div>'
  })
