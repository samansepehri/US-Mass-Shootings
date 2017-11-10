class StateYearChart {
  constructor(parent) {
    let width = 500;
    let height = 200;
    this.width = width;
    this.height = height;

    parent.append("h2")
      .text("States through time");

    this.div = parent.append("div");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(data) {
    let stateCount = data.metadata.stateCount;
    let yearCount = data.metadata.yearCount;
    let accumulatedFractionsPerYear = [];
    for (let i = 0; i < yearCount; i++) {
      accumulatedFractionsPerYear.push([0]);
    }

    for (let i = 0; i < data.data.length; i++) {
      // for each state
      let stateData = data.data[i];
      let dataPerYear = stateData.incidentCountFraction;
      for (let j = 0; j < dataPerYear.length; j++) {
        // for each year
        let fraction = dataPerYear[j];
        let yearAccumulatedFractions = accumulatedFractionsPerYear[j];
        let lastAccumulatedFraction = yearAccumulatedFractions[yearAccumulatedFractions.length - 1];
        let newAccumulatedFraction = lastAccumulatedFraction + fraction;
        yearAccumulatedFractions.push(newAccumulatedFraction);
      }
    }

    // console.log(accumulatedFractionsPerYear);
    let paths = [];
    let xScale = (x) => { return x * this.width / yearCount; }
    let yScale = (y) => { return y * this.height; }
    for (let i = 0; i < stateCount; i++) {
      // for each state, make a path
      let path = d3.path();
      // accumulatedFractionsPerYear[year][state]
      path.moveTo(
        xScale(0),
        yScale(accumulatedFractionsPerYear[0][i]));
      for (let j = 1; j < yearCount; j++) {
        path.lineTo(
          xScale(j),
          yScale(accumulatedFractionsPerYear[j][i]));
      }
      for (let j = yearCount - 1; j >= 0; j--) {
        path.lineTo(
          xScale(j),
          yScale(accumulatedFractionsPerYear[j][i + 1]));
      }
      path.closePath();
      paths.push(path);
    }

    let path = this.svg.selectAll("path.state-through-time").data(paths);
    let pathEnter = path.enter()
      .append("path")
      .classed("state-through-time", true);
    path.merge(pathEnter)
      .attr("d", (d) => {
        return d;
      })
      .attr("fill", (d, i) => {
        if (i % 2 == 0) return "black";
        else return "white";
      })
  }
}