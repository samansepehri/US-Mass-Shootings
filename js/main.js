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
  return Math.max.apply(Math, array);
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

  let tileMapData = {
    metadata: {
      rowCount: 8,
      colCount: 12
    },
    data: [
    ]
  };

  let minYear = 1966, maxYear = 2017;
  let years = new Array();
  for(y = 0; y < maxYear-minYear+1; y++){
    years[y] = minYear+y; 
  }
  let states = new Array();

  d3.csv("data/MSDV5P.csv", function (error, data) {
    d3.csv("data/states.csv", function (error, thisState) {
      thisState.forEach(function(state, n) {
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
        states[n] = state.Abbreviation;
      });
      tileMap.update(tileMapData);
      
      let selectedYears = years.slice(years.length - 5);
      let selectedStates = states.slice(states.length - 10);

      stateYearChartData.metadata.years = selectedYears;
      stateYearChartData.metadata.states = selectedStates;

      let stateYearIncidentCount = new Array();
      selectedStates.forEach(function (state, sInd) {
        selectedYears.forEach(function (year, yInd) {
           let tempData = data.filter(d =>
            d.State == selectedStates[sInd] &&
            Number(d.Date.split('/')[2]) == year);
            stateYearIncidentCount[sInd * selectedYears.length + yInd] = {state: state,
                                                                          year: year,
                                                                          incidentCount: tempData.length};
        });
      })
      selectedStates.forEach(function (state, sInd) {
        
        let fraction =  new Array();
        selectedYears.forEach(function (year, yInd) {
          let totalPerYear = stateYearIncidentCount.filter(d => d.year == year).sum('incidentCount')
          let thisStateThisYear = stateYearIncidentCount.filter(d => d.year == year && d.state == state);
          fraction[yInd] = thisStateThisYear[0].incidentCount / totalPerYear;
        });
        stateYearChartData.data[sInd] = { state: state, incidentCountFraction: fraction }
      })
      stateYearChart.update(stateYearChartData);
    })

    let incidentTableData = [];
    let scatterPlotData = [];

    data.forEach(function(item, n) {
      // TODO do not hardcode max number of incidents
      let killed = parseInt(item.Fatalities);
      let injured = parseInt(item.Injured);

      if (n < 10) {
        incidentTableData.push({
          title: item.Title,
          date: parseDate(item.Date),
          state: item.State,
          location: item.Location,
          killed: killed,
          injured: injured,
          area: item["Incident Area"]
        });
      }

      // TODO do not hardcode criterion to filter incidents
      if (injured + killed < 60) {
        scatterPlotData.push({
          title: item.Title,
          injured: injured,
          killed: killed
        });
      }
    });
    incidentTable.update(incidentTableData);
    
    main.yearChartData = [];
    for(y = 0; y < years.length; y++){
      let thisYear = data.filter(d => years[y] == Number(d.Date.split('/')[2]));
      let killed = thisYear.sum("Fatalities");
      let injured = thisYear.sum("Injured");
      let totalVictims = killed + injured;
      main.yearChartData.push({
        year: years[y],
        incidentCount: thisYear.length,
        killedCount: killed,
        injuredCount: injured,
        totalVictimCount: totalVictims
      });
    }
    let criterion = "incidentCount";
    yearChart.update(main.yearChartData, criterion);

    let dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
    for(i=0; i<7; i++){
      let thisDay = data.filter(item => dayNames[i] == item.DayOfTheWeek);
      let totalVictims = thisDay.sum('Fatalities') + thisDay.sum('Injured');
      dayChartData[i] = {
        totalVictims: totalVictims,
        incidentCount: thisDay.length
      };
    }
    dayChart.update(dayChartData);

    
  })

  scatterPlot.update(scatterPlotData);
}

init();