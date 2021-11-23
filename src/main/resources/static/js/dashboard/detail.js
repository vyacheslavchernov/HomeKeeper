let rubChar = "₽"
let monthId;

window.onload = async function(){ 
    let url_string = window.location.href
    let url = new URL(url_string);
    monthId = url.searchParams.get("id");



    let response = await fetch('/api/monthdata/get?id=' + monthId, {
        method: 'GET',
        credentials: 'include'
      });
      
      let responce = await response;
      let monthData;
      let prevMonthData;
      let calcData;

      if (responce.ok) {
        try {monthData = await response.json()} catch {window.location.href = "/error"};
        console.log(monthData)

        response = await fetch('/api/monthdata/getCalc?id=' + monthData["id"], {
            method: 'GET',
            credentials: 'include'
        });

        if (responce.ok) {
            try {calcData = await response.json()} catch {window.location.href = "/error"};
            console.log(calcData)

            response = await fetch('/api/monthdata/getPrev?id=' + monthData["id"], {
                method: 'GET',
                credentials: 'include'
            });

            if (responce.ok) {
                prevMonthData = await response.json();
                console.log(prevMonthData)

                let totalCommunal = calcData["coldwater"] + calcData["hotwater"] + calcData["electricity"] + calcData["drainage"];
                let total = totalCommunal + monthData["rent"] + monthData["ethernet"];

                console.log(totalCommunal)
                console.log(total)

                document.getElementById("mainCardHeader").innerHTML = "Главные цифры на 10." + monthData['month'] + "." + monthData["year"]
                document.getElementById("mainCardTotalSum").innerHTML = total.toFixed(2) + rubChar
                document.getElementById("mainCardTotalSumWithoutEthernet").innerHTML = (total - monthData['ethernet']).toFixed(2) + rubChar
                document.getElementById("mainCardTotalSumCommunal").innerHTML = totalCommunal.toFixed(2) + rubChar
                document.getElementById("mainCardTotalSumOnPerson").innerHTML = (total / monthData["peoples"]).toFixed(2) + rubChar

                document.getElementById("constCardRent").innerHTML = monthData['rent'] + rubChar
                document.getElementById("constCardEthernet").innerHTML = monthData['ethernet'] + rubChar
                document.getElementById("constCardPersons").innerHTML = monthData['peoples']

                document.getElementById("communCardElect").innerHTML = calcData['electricity'].toFixed(2) + rubChar
                document.getElementById("communCardHot").innerHTML = calcData['hotwater'].toFixed(2) + rubChar
                document.getElementById("communCardCold").innerHTML = calcData['coldwater'].toFixed(2) + rubChar
                document.getElementById("communCardDrain").innerHTML = calcData['drainage'].toFixed(2) + rubChar

                document.getElementById("counterCardElect").innerHTML = monthData['electricity'] + " (" + (monthData['electricity'] - prevMonthData['electricity']) + ")"
                document.getElementById("counterCardHot").innerHTML = monthData['hotwater'] + " (" + (monthData['hotwater'] - prevMonthData['hotwater']) + ")"
                document.getElementById("counterCardCold").innerHTML = monthData['coldwater'] + " (" + (monthData['coldwater'] - prevMonthData['coldwater']) + ")"
                document.getElementById("counterCardDrain").innerHTML = (monthData['hotwater'] - prevMonthData['hotwater'])+(monthData['coldwater'] - prevMonthData['coldwater'])
            } else {
                alert("Произошла ошибка при загрузке данных предыдущего месяца(" + responce.status + "). Данные не были получены.")
            }
        } else {
            alert("Произошла ошибка при расчёте искомого месяца(" + responce.status + "). Данные не были получены.")
        }
      } else {
          alert("Произошла ошибка при загрузке данных искомого месяца(" + responce.status + "). Данные не были загружены.")
      }
}