Array.prototype.sum = function (prop) {
  let total = 0
  for ( let i = 0, _len = this.length; i < _len; i++ ) {
      total += Number(this[i][prop]);
  }
  return total
}
Array.prototype.max = function(prop){
  let array = new Array(7);
  for ( let i = 0, _len = this.length; i < _len; i++ ) {
    array[i] = Number(this[i][prop]);
  } 
  return Math.max.apply(Math, array);;
}

function parseDate(str) {
  let s = str.split("/");
  return {
    month: parseInt(s[0]),
    day  : parseInt(s[1]),
    year : parseInt(s[2])
  }
}

function loadData(path) {
  return new Promise((resolve, reject) => {
    d3.json(path, (error, data) => {
      if (error == null) resolve(data);
      else reject(error);
    })
  });
}

let yearChartData = [
  {
    "year": 1900,
    "incidentCount": 3
  },
  {
    "year": 1950,
    "incidentCount": 4
  },
  {
    "year": 1980,
    "incidentCount": 10
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
];

let stateYearChartData = {
  metadata: {
    years: [1990, 1993, 1997, 2004],
    states: ["AA", "BB", "CC"]
  },
  data: [
    {
      state: "AA",
      incidentCountFraction: [0.2, 0.4, 0.1, 0.3]
    },
    {
      state: "BB",
      incidentCountFraction: [0.1, 0.3, 0.8, 0.3]
    },
    {
      state: "CC",
      incidentCountFraction: [0.7, 0.3, 0.1, 0.4]
    }
  ]
};

let scatterPlotData = [
  {
    title: "incident 1",
    injured: 3,
    killed: 4
  },
  {
    title: "incident 2",
    injured: 5,
    killed: 10
  },
  {
    title: "incident 3",
    injured: 6,
    killed: 7
  },
  {
    title: "incident 4",
    injured: 2,
    killed: 2
  },
  {
    title: "incident 5",
    injured: 3,
    killed: 3
  },
  {
    title: "incident 5",
    injured: 1,
    killed: 1
  }
];

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

  let stateYearChart = new StateYearChart(body);
  main.stateYearChart = stateYearChart;

  let scatterPlot = new ScatterPlot(body);
  main.scatterPlot = scatterPlot;

  // let yearChartData = await loadData("data/data.json");

  let tileMapData = {
    metadata: {
      rowCount: 8,
      colCount: 12
    },
    data: [
    ]
  };
  d3.csv("data/MSDV5P.csv", function (error, data) {
    d3.csv("data/states.csv", function (error, states) {
      states.forEach(function(state, n) {
        let thisState = data.filter(d => d.State == state.Abbreviation);
        let incidentCount = 0;
        thisState.forEach(function (d) {
          incidentCount += Number(d["Total victims"]);
        });
        tileMapData.data[n] = {
          row: parseInt(state.Row),
          col:parseInt(state.Space),
          name: state.Abbreviation,
          incidentCount: incidentCount
        };
      });
      tileMap.update(tileMapData);
    })

    let incidentTableData = [];
    data.forEach(function(item, n) {
      // TODO do not hardcode max number of incidents
      if (n < 10) {
        incidentTableData.push({
          title: item.Title,
          date: parseDate(item.Date),
          state: item.State,
          location: item.Location,
          killed: parseInt(item.Fatalities),
          injured: parseInt(item.Injured),
          area: item["Incident Area"]
        });
      }
    });
    incidentTable.update(incidentTableData);

    let minYear = 1966, maxYear = 2017;
    for(y = 0; y < maxYear-minYear+1; y++){
      let thisYear = data.filter(d => minYear+y == Number(d.Date.split('/')[2]));
      let thisYearTotal = thisYear.sum('Fatalities') + thisYear.sum('Injured');
      yearChartData[y] = {year: minYear+y, incidentCount: thisYearTotal};
    }
    yearChart.update(yearChartData);

    let dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for(i=0; i<7; i++){
      let thisDay = data.filter(item => dayNames[i] == item.DayOfTheWeek);
      let incidentCount = thisDay.sum('Fatalities') + thisDay.sum('Injured');
      dayChartData[i] = {incidentCount: incidentCount};
    }
    dayChart.update(dayChartData);


    
  })
  
  
  stateYearChart.update(stateYearChartData);
  scatterPlot.update(scatterPlotData);
}

init();