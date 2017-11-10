class ScatterPlot {
  constructor(parent) {
    let width = 500;
    let height = 200;
    this.width = width;
    this.height = height;

    this.div = parent.append("div");
    this.div.append("h2")
      .text("Scatter plot, killed-injured");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(data) {
    let xScale = (x) => {
      return x * 10;
    };
    let yScale = (y) => {
      return this.height - y * 10;
    };
    let radiusScale = (victims) => {
      return victims * 0.2;
    }


    let circle = this.svg.selectAll("circle.incident-point").data(data);
    let circleEnter = circle.enter()
      .append("circle")
      .attr("fill", "#0000aa");
    circle.merge(circleEnter)
      .attr("cx", (d) => { return xScale(d.killed); })
      .attr("cy", (d) => { return yScale(d.injured); })
      .attr("r", (d) => {
        let victims = d.injured + d.killed;
        return radiusScale(victims);
      })
  }
}