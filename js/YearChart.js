class YearChart {
  constructor(parent) {
    let width = 500;
    let height = 500;

    this.div = parent.append("div");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(dataByYear) {
    console.log(dataByYear);

    let g = this.svg.selectAll("g.year-bar")
      .data(dataByYear);
    let gEnter = g.enter()
      .append("g")
      .each(function(d, i) {
        let d3this = d3.select(this);
        let w = 20;
        let xMargin = 5;
        let y0 = 100;
        let scaleIncidentCount = (incidentCount) => {
          return incidentCount * 3;
        }
        d3this
          .append("rect")
          .attr("transform", `translate(
            ${i * (xMargin + w)},
            ${y0 - scaleIncidentCount(d.incidentCount)})`)
          .attr("fill", "black")
          .attr("height", scaleIncidentCount(d.incidentCount))
          .attr("width", w);
      });
  }
}