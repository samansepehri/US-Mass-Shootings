class ScatterPlot {
  constructor(parent) {
    let width = 300;
    let height = 300;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("overflow", "visible")
      .style("display", "inline-block");
    this.div.append("h2")
      .text("Scatter plot, killed-injured");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("padding-left", "50px")
      .style("padding-bottom", "40px");

    this.gXAxis = this.svg.append("g");
    this.gYAxis = this.svg.append("g");
    this.xLabel = this.svg.append("text")
      .text("killed")
      .attr("text-anchor", "middle");
    this.yLabel = this.svg.append("text")
      .text("injured")
      .attr("text-anchor", "middle");
  }

  update(data) {
    let maxInjured = 0;
    let maxKilled = 0;
    let minVictims = Number.MAX_SAFE_INTEGER;
    let maxVictims = 0;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let injured = item.injured;
      let killed = item.killed;
      let victims = injured + killed;
      if (injured > maxInjured) maxInjured = injured;
      if (killed > maxKilled) maxKilled = killed;
      if (victims > maxVictims) maxVictims = victims;
      if (victims < minVictims) minVictims = victims;
    }

    let xScale = d3.scaleLinear()
      .domain([0, maxKilled])
      .range([0, this.width]);
    let yScale = d3.scaleLinear()
      .domain([0, maxInjured])
      .range([this.height, 0]);

    let xAxis = d3.axisBottom(xScale);
    this.gXAxis
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis);
    this.xLabel
      .attr("transform", `translate(${this.width * 0.5}, ${this.height + 30})`);
    
    let yAxis = d3.axisLeft(yScale);    
    this.gYAxis
      .attr("transform", `translate(0, 0)`)
      .call(yAxis);
    this.yLabel
      .attr("transform", `translate(${-30}, ${this.height * 0.5}) rotate(-90) `)

    let colorScale = d3.scaleLinear()
      .domain([minVictims, maxVictims])
      .range(["#ffeeee", "#ff0000"]);

    let circle = this.svg.selectAll("circle.incident-point").data(data);
    let circleEnter = circle.enter()
      .append("circle")
      .attr("fill", "#0000aa")
      .classed("incident-point", true);
    circle.merge(circleEnter)
      .attr("cx", (d) => { return xScale(d.killed); })
      .attr("cy", (d) => { return yScale(d.injured); })
      .attr("r", 2.5)
      .attr("fill", (d) => {
        let victims = d.injured + d.killed;
        return colorScale(victims);
      });

    circle.exit()
      .attr("cx", (d) => { return xScale(d.killed); })
      .remove();
  }
}