function loadData(path) {
  return new Promise((resolve, reject) => {
    d3.json(path, (error, data) => {
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

let incidentTableData = [
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
];

let dayChartData = [
  {
    incidentCount: 1
  },
  {
    incidentCount: 30
  },
  {
    incidentCount: 44
  },
  {
    incidentCount: 3
  },
  {
    incidentCount: 1
  },
  {
    incidentCount: 20
  },
  {
    incidentCount: 10
  }
]

main = {};

async function init() {
  let body = d3.select("body");
  
  let yearChart = new YearChart(body);
  main.yearChart = yearChart;

  let tileMap = new TileMap(body);
  main.tileMap = tileMap;

  let incidentTable = new IncidentTable(body);
  main.incidentTable = incidentTable;

  let dayChart = new DayChart(body);
  main.dayChart = dayChart;

  let yearChartData = await loadData("data/data.json");

  yearChart.update(yearChartData);
  tileMap.updateMap(tileMapData);
  incidentTable.update(incidentTableData);
  dayChart.update(dayChartData);
}

init();