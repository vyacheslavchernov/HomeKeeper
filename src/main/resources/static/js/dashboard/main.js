document.getElementById("modalMonthDataSave").addEventListener("click",  async function() {
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
          alert("Данные успешно добавлены!");
      } else {
          alert("Произошла ошибка при добавлении данных (" + result.status + "). Данные не были добавлены.")
      }
});

window.onload = async function(){ 
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
            try{calcData = await response.json()} catch {window.location.href = "/error"};
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
