function loadDataByYear() {
  return new Promise((resolve, reject) => {
    d3.json("data/data.json", (error, data) => {
      if (error == null) resolve(data);
      else reject(error);
    })
  });
}

let tileMapData = {
  metadata: {
    rowCount: 10,
    colCount: 5
  },
  data: [
    {
      row: 1,
      col: 0,
      name: "A",
      incidentCount: 1
    },
    {
      row: 1,
      col: 1,
      name: "B",
      incidentCount: 4
    },
    {
      row: 1,
      col: 2,
      name: "C",
      incidentCount: 3
    },
    {
      row: 2,
      col: 2,
      name: "B",
      incidentCount: 2
    }
  ]
}

main = {};

async function init() {
  let body = d3.select("body");
  let yearChart = new YearChart(body);
  let tileMap = new TileMap(body);
  main.tileMap = tileMap;
  let dataByYear = await loadDataByYear();
  yearChart.update(dataByYear);
  tileMap.updateMap(tileMapData);
}

init();