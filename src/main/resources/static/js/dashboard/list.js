// Компонент заголовка таблицы
Vue.component('table-head',{
    template: '<thead><tr><th scope="col">ID</th><th scope="col">Год</th><th scope="col">Месяц</th><th scope="col"></th></tr></thead>'
})

// Компонент тела таблицы
Vue.component('table-body', {
    props: ['data'],
    template: '<tbody class="table-striped placeholder-glow"><table-row  v-for="rowData in data" :rowData="rowData" :key="rowData[\'id\']"/></tbody>'
})

// Компонент строки данных в таблице
Vue.component('table-row', {
    props: ['rowData'],
    template: '<tr class="position-relative">'+
    '<th scope="row">{{rowData["id"]}}</th>'+
    '<td>{{rowData["year"]}}</td>'+
    '<td>{{rowData["month"]}}</td>'+
    '<td> <a class="nav-link stretched-link" v-bind:href="\'/dashboard/list/detail?id=\' + rowData[\'id\']" > Подробнее </a> </td>'+
    '</tr>'
})

// Компонент таблицы с загрузко данных по месяца и отображением онных
var app = new Vue({
    el: '#table',
    data: {
        monthDataList: null,
        displayedData: null
    },
    created: async function () {
        // TODO: Перевести на vue-resources
        let response = await fetch('/api/monthdata/all', {
            method: 'GET',
            credentials: 'include'
        })

        let responce = await response;

        if (responce.ok) {
            let data = await response.json();

            data.sort((id1, id2) => {
                return compareObjects(id1, id2, 'id')
            })

            console.log(data);
            this.monthDataList = data;
            this.displayedData = data;
        } else {
            toastLaunch("warning", "Ошибка", "", "Произошла ошибка при загрузке расчётов (" + responce.status + "). Данные не были получены.", "danger")
        }
    },
    template: '<table class="table table-striped table-hover"><table-head/><table-body :data="this.displayedData" /></table>'
  })


//comparator for dict sort
function compareObjects(object1, object2, key) {
    const obj1 = object1[key].toUpperCase()
    const obj2 = object2[key].toUpperCase()

    if (obj1 > obj2) {
        return -1
    }
    if (obj1 < obj2) {
        return 1
    }
    return 0
}
// dict sort example
// books.sort((book1, book2) => {
//     return compareObjects(book1, book2, 'name')
// })

// Обработчки кнопки открытия месяца по введённому id
document.getElementById("button-addon2").addEventListener("click",  async function() {
    let id = document.getElementById("monthToOpenID").value
    window.location.href = "/dashboard/list/detail?id=" + id
})