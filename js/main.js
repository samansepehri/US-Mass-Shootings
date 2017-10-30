function loadDataByYear() {
  return new Promise((resolve, reject) => {
    d3.json("data/data.json", (error, data) => {
      if (error == null) resolve(data);
      else reject(error);
    })
  });
}

async function init() {
  let yearChart = new YearChart(d3.select("body"));
  let dataByYear = await loadDataByYear();
  yearChart.update(dataByYear);
}

init();