let pathColors = [
  "#456f98",
  "#73a84f",
  "#fab14d",
  "#f9f18c"
];

function numberToPathColor(i) {
  return pathColors[i % pathColors.length];
}

class StateYearChart {
  constructor(parent) {
    let width = 250;
    let height = 200;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("margin-right", "50px")
      .style("display", "inline-block")
      .style("height", "500px")
      .style("overflow", "visible");
    this.div.append("h2")
      .text("States through time")
      .style("overflow", "visible")
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("padding-left", "26px");
    
    this.gPaths = this.svg.append("g");
    this.gXAxis = this.svg.append("g");
  }

  update(data) {
    let years = data.metadata.years;
    let states = data.metadata.states;
    let stateCount = states.length;
    let yearCount = years.length;
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
    let xScale = (x) => { return x * this.width / (yearCount - 1); }
    let yScale = (y) => { return y * this.height; }
    for (let i = 0; i < stateCount; i++) {
      // for each state, make a path
      let path = d3.path();
      // accumulatedFractionsPerYear[year][state]
      path.moveTo(
        xScale(0),
        yScale(data.data[0].incidentCountFraction));
      for (let j = 1; j < yearCount; j++) {
        path.lineTo(
          xScale(j),
          yScale(data.data[j].incidentCountFraction));
      }
      /*
      for (let j = yearCount - 1; j >= 0; j--) {
        path.lineTo(
          xScale(j),
          yScale(accumulatedFractionsPerYear[j][i + 1]));
      }
      */
      // path.closePath();
      paths.push(path);
    }

    let path = this.gPaths.selectAll("path.state-through-time").data(paths);
    let pathEnter = path.enter()
      .append("path")
      .classed("state-through-time", true);
    path.merge(pathEnter)
      .attr("d", (d) => {
        return d;
      })
      .attr("fill", "none")
      .style("stroke", "red")
      .style("stroke-width", "1px");
    
    // axis
    let xAxisScale = d3.scaleOrdinal()
      .domain(years)
      .range(years.map((d, i) => { return xScale(i); }));
    let xAxis = d3.axisBottom(xAxisScale);
    this.gXAxis
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis);

    // state labels
    let stateLabel = this.svg.selectAll("text.state-label").data(states);
    let stateLabelEnter = stateLabel.enter()
      .append("text")
      .classed("state-label", true);
    stateLabel.merge(stateLabelEnter)
      .text((d) => {
        return d;
      })
      .attr("text-anchor", "end")
      .attr("dy", "0.5em")
      .attr("transform", (d, i) => {
        return `translate(-4, ${yScale(data.data[i].incidentCountFraction)})`;
      })
  }
}