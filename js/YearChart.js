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
    let d3this = d3.select(this);
    let w = 40;
    let xMargin = 5;
    let x0 = xMargin + w * 0.5;
    let y0Bar = 30;
    let y0Label = 50;
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
        ${x0 + i * (xMargin + w) - w * 0.5},
        ${y0Bar - scaleIncidentCount(d.incidentCount)})`;
      })
      .attr("fill", "black")
      .attr("height", (d) => {
        return scaleIncidentCount(d.incidentCount)
      })
      .attr("width", w)
      .on("click", (d, i) => {
        main.tileMap.updateContent([
          {
            "state": "A",
            "incidentCount": 90
          },
          {
            "state": "B",
            "incidentCount": 10
          }
        ]);
      });
    
    let yearLabel = this.svg.selectAll("text.year-label")
      .data(dataByYear);
    let yearLabelEnter = yearLabel.enter()
      .append("text")
      .classed("year-label", true);
    
    yearLabel.merge(yearLabelEnter)
      .text((d) => {
        return d.year;
      })
      .attr("text-anchor", "middle")
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w)},
        ${y0Label})`;
      });
  }
}