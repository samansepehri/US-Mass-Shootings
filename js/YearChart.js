class YearChart {
  constructor(parent) {
    let width = 500;
    let height = 100;

    this.div = parent.append("div");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(dataByYear) {
    console.log(dataByYear);

    let d3this = d3.select(this);
    let w = 20;
    let xMargin = 5;
    let y0 = 100;
    let scaleIncidentCount = (incidentCount) => {
      return incidentCount * 3;
    }
    let rect = this.svg.selectAll("rect.year-bar")
      .data(dataByYear);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("year-bar", true);
    rect.merge(rectEnter)
      .attr("transform", (d, i) => {
        return `translate(
        ${i * (xMargin + w)},
        ${y0 - scaleIncidentCount(d.incidentCount)})`
      })
      .attr("fill", "black")
      .attr("height", (d) => {
        return scaleIncidentCount(d.incidentCount)
      })
      .attr("width", w)
      .on("click", (d, i) => {
        main.tileMap.updateContent([
          
        ]);
      });
  }
}