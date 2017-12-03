Array.prototype.sum = function (prop) {
  let total = 0
  for (let i = 0, _len = this.length; i < _len; i++) {
      total += Number(this[i][prop]);
  }
  return total
}
Array.prototype.max = function(prop){
  let array = new Array(7);
  for (let i = 0, _len = this.length; i < _len; i++) {
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
    d3.csv(path, (error, data) => {
      if (error == null) {
        resolve(data);
      }
      else {
        reject(error);
      }
    })
  });
}

function computeTileMapData(statesData, incidentsData) {
  let tileMapData = [];
  statesData.forEach(function(state, i) {
    let stateIncidents = incidentsData.filter(d => d.State == state.Abbreviation);
    let incidentCount = 0;
    let injuredCount = 0;
    let killedCount = 0;
    stateIncidents.forEach(function (d) {
      incidentCount++;
      injuredCount += Number(d["Injured"]);
      killedCount += Number(d["Fatalities"]);
    });
    // console.log(state.Abbreviation, incidentCount)
    tileMapData.push({
      row: parseInt(state.Row),
      col:parseInt(state.Space),
      name: state.Abbreviation,
      incidentCount: incidentCount,
      injuredCount: injuredCount,
      killedCount: killedCount,
      totalVictimCount: injuredCount + killedCount
    });
  });
  return tileMapData;
}

function computeIncidentTableData(incidentsData) {
  let incidentTableData = [];
  incidentsData.forEach(function(item, n) {
    let killed = parseInt(item.Fatalities);
    let injured = parseInt(item.Injured);
    incidentTableData.push({
      id: item.id,
      title: item.Title,
      date: parseDate(item.Date),
      state: item.State,
      location: item.Location,
      killed: killed,
      injured: injured,
      area: item["Incident Area"]
    });
  });
  return incidentTableData;
}

function computeScatterPlotData(incidentsData) {
  let scatterPlotData = [];

  incidentsData.forEach(function(item, n) {
    let killed = parseInt(item.Fatalities);
    let injured = parseInt(item.Injured);
    scatterPlotData.push({
      id: item.id,
      title: item.Title,
      injured: injured,
      killed: killed,
      date: item.Date,
      state: item.State
    });
  });

  return scatterPlotData;
}

main = {};

main.updateCriterion = function(criterion) {
  main.criterion = criterion;
  main.yearChart.update(main.yearChartData, criterion);
  main.tileMap.update(main.tileMapData, criterion);
  main.dayChart.update(main.dayChartData, criterion);
  main.stateYearChart.update(main.stateYearChartData, criterion);
}

function computeDayChartData(data) {
  let dayChartData = [];
  let dayNames = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"];
  
  for (let i = 0; i < 7; i++) {
    let thisDay = data.filter(item => dayNames[i] == item.DayOfTheWeek);
    let killedCount = thisDay.sum("Fatalities");
    let injuredCount = thisDay.sum("Injured");
    let incidentCount = thisDay.length;
    dayChartData.push({
      incidentCount: incidentCount,
      injuredCount: injuredCount,
      killedCount: killedCount,
      totalVictimCount: injuredCount + killedCount
    });
  }

  return dayChartData;
}
function computeYearChartData(filteredData){
  let yearChartData = [];
  for (let y = 0; y < main.years.length; y++) {
    let thisYear = filteredData.filter(d => main.years[y] == Number(d.Date.split('/')[2]));
    let killed = thisYear.sum("Fatalities");
    let injured = thisYear.sum("Injured");
    let totalVictims = killed + injured;
    let incidentCount = thisYear.length;
    yearChartData.push({
      year: main.years[y],
      incidentCount: incidentCount,
      killedCount: killed,
      injuredCount: injured,
      totalVictimCount: totalVictims
    });
  }
  return yearChartData;
}

function computeStateYearChartData(allData, selectedYears, selectedStates) {

  let stateYearChartData = [];
  selectedYears.forEach(function(year, y) {
    stateYearChartData[y] = [];
    selectedStates.forEach(function (state, s) {

      let incidents = allData.filter(d =>
        d.State == state/*.Abbreviation*/ &&
        Number(d.Date.split('/')[2]) == year);
      
      let incidentCount = incidents.length;
      let killedCount = incidents.sum("Fatalities");
      let injuredCount = incidents.sum("Injured");
      let totalVictimCount = killedCount + injuredCount;

      stateYearChartData[y].push({
        year: year,
        state: state,
        incidentCount: incidentCount,
        killedCount: killedCount,
        injuredCount: injuredCount,
        totalVictimCount: totalVictimCount
      });
    });

  });

  return stateYearChartData;
}

main.updateYearRange = function(minYear, maxYear) {
  main.selectedYears = [];
  if (minYear == maxYear) main.selectedYears = [minYear];
  else {
    for (let i = minYear; i <= maxYear; i++) {
      main.selectedYears.push(i);
    }
  }

  main.filteredDataByYear = main.allIncidents.filter((incident) => {
    let year = incident.Date.split('/')[2];
    return minYear <= year && year <= maxYear;
  });

  main.filteredData = main.filteredDataByState.filter((incident) => {
    let year = incident.Date.split('/')[2];
    return minYear <= year && year <= maxYear;
  });

  main.updateLinkedCharts();

}
main.updateStateList = function(selectedStates) {
  main.selectedStates = selectedStates;
  if (selectedStates.length < 1) {
    main.filteredData = main.filteredDataByYear;
    main.filteredDataByState = main.allIncidents;
    
  } else {
    main.filteredDataByState = main.allIncidents.filter((incident) => {
      let state = incident.State;
      return selectedStates.indexOf(state) > -1;
    });
    main.filteredData = main.filteredDataByYear.filter((incident) => {
      let state = incident.State;
      return selectedStates.indexOf(state) > -1;
    });
  }
  
  main.updateLinkedCharts();
}

main.updateLinkedCharts = function() {

  main.yearChartData = computeYearChartData(main.filteredData);
  main.yearChart.update(main.yearChartData, main.criterion);

  main.tileMapData.data = computeTileMapData(main.statesData, main.filteredDataByYear);
  main.tileMap.update(main.tileMapData, main.criterion);

  main.incidentTableData = computeIncidentTableData(main.filteredData);
  main.incidentTable.update(main.incidentTableData);

  main.scatterPlotData = computeScatterPlotData(main.filteredData);
  main.scatterPlot.update(main.scatterPlotData);

  main.dayChartData = computeDayChartData(main.filteredData);
  main.dayChart.update(main.dayChartData, main.criterion);

  let selectedYears = main.selectedYears;
  let selectedStates = main.selectedStates;
  main.stateYearChartData = computeStateYearChartData(main.filteredDataByYear, selectedYears, selectedStates);
  console.log(main.stateYearChartData);

  //main.stateYearChart.update(main.stateYearChartData, main.criterion);
}

main.animation = {delay: 250, duration: 500};

async function init() {
  let body = d3.select("body");

  let div1 = body.append("div").style("display", "inline");

  let yearChart = new YearChart(div1);
  main.yearChart = yearChart;

  let tileMap = new TileMap(div1);
  main.tileMap = tileMap;

  let incidentTable = new IncidentTable(div1);
  main.incidentTable = incidentTable;

  let div2 = body.append("div").style("display", "inline");
  let dayChart = new DayChart(div2);
  main.dayChart = dayChart;

  let stateYearChart = new StateYearChart(div2);
  main.stateYearChart = stateYearChart;

  let scatterPlot = new ScatterPlot(div2);
  main.scatterPlot = scatterPlot;

  let tileMapData = {
    metadata: {
      rowCount: 8,
      colCount: 12
    },
    data: []
  };
  main.tileMapData = tileMapData;

  let incidentTableData = [];
  let scatterPlotData = [];
  let dayChartData = [];
  

  main.criterion = "incidentCount";
  let criterion = main.criterion;

  let minYear = 1966, maxYear = 2017;
  let years = new Array();
  for (let y = 0; y < maxYear - minYear + 1; y++) {
    years[y] = minYear + y;
  }
  main.years = years;

  let data = await loadData("data/MSDV5P.csv");
  let statesData = await loadData("data/states.csv");
  main.statesData = statesData;

  data.forEach(function(incident, i) {
    incident.State = incident.State.trim();
    incident.id = i;
  });
  main.allIncidents = data;
  main.filteredData = main.allIncidents;
  main.filteredDataByYear = main.allIncidents;
  main.filteredDataByState = main.allIncidents;

  let states = [];
  statesData.forEach(function(state, i) {
    states.push(state.Abbreviation);
  });
  main.allStates = states;
  main.selectedStates = [];// states;

  main.yearChartData = [];
  for (let y = 0; y < years.length; y++) {
    let thisYear = main.allIncidents.filter(d => years[y] == Number(d.Date.split('/')[2]));
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
  yearChart.update(main.yearChartData, criterion);
  main.updateYearRange(minYear, maxYear);
}

init();
