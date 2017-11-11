class YearChart {
  constructor(parent) {
    let width = 700;
    let height = 200;
    this.width = width;
    this.height = height;
    
    this.div = parent.append("div");
    this.div.append("h2")
      .text("Incidents by year")
      .attr("overflow", "visible");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");
  }

  update(data) {
    let xMargin = 5;
    let w = (this.width - xMargin * data.length) / data.length;
    let x0 = xMargin + w * 0.5;
    let y0Bar = this.height - 70;
    let y0Label = this.height - 50;

    let maxIncidentCount = 0;
    data.forEach((item) => {
      if (item.incidentCount > maxIncidentCount) maxIncidentCount = item.incidentCount;
    });

    let scaleIncidentCount = (incidentCount) => {
      return incidentCount * y0Bar / maxIncidentCount;
    }
    let rect = this.svg.selectAll("rect.year-bar")
      .data(data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("year-bar", true);
    
    rect.merge(rectEnter)
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w) - w},
        ${y0Bar - scaleIncidentCount(d.incidentCount)})`;
      })
      .attr("fill", "black")
      .attr("height", (d) => {
        return scaleIncidentCount(d.incidentCount)
      })
      .attr("width", w)
      .on("click", (d, i) => {
        main.tileMap.update([
          // ???
        ]);
      });
    
    let yearLabel = this.svg.selectAll("text.year-label")
      .data(data);
    let yearLabelEnter = yearLabel.enter()
      .append("text")
      .classed("year-label", true)
    
    yearLabel.merge(yearLabelEnter)
      .text((d) => {
        return d.year;
      })
      .attr("text-anchor", "middle")
      .style("font-size", "0.9em")
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w)},
        ${y0Label})
        rotate(-90)`;
      });
  }
}