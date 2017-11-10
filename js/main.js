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
    rowCount: 5,
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
  let incidentTable = new IncidentTable(body);
  main.tileMap = tileMap;
  let dataByYear = await loadDataByYear();
  yearChart.update(dataByYear);
  tileMap.updateMap(tileMapData);
  incidentTable.update([
    {
      title: "title A",
      date: "01/01/01",
      state: "AA"
    },
    {
      title: "title B",
      date: "02/02/02",
      state: "BB"
    },
    {
      title: "title C",
      date: "02/02/02",
      state: "CC"
    },
    {
      title: "title D",
      date: "02/02/02",
      state: "BB"
    },
    {
      title: "title E",
      date: "02/02/02",
      state: "DD"
    }
  ])
}

init();