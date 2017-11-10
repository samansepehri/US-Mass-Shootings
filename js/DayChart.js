let dayNames = [
  "monday", "tuesday",
  "wednesday", "thusday",
  "friday",
  "saturday", "sunday"
]

function numberToDayName(i) {
  return dayNames[i];
}

class DayChart {
  constructor(parent) {
    let width = 500;
    let height = 100;

    parent.append("h2")
      .text("Incidents by day");
    this.div = parent.append("div");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(data) {
    let w = 40;
    let xMargin = 5;
    let x0 = xMargin + w * 0.5;
    let y0Bar = 30;
    let y0Label = 50;
    let scaleIncidentCount = (incidentCount) => {
      return incidentCount * 3;
    }
    let rect = this.svg.selectAll("rect.day-bar")
      .data(data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("day-bar", true);
    
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
        console.log("selected day ", d);
      });
    
    let dayLabel = this.svg.selectAll("text.day-label")
      .data(data);
    let dayLabelEnter = dayLabel.enter()
      .append("text")
      .classed("day-label", true);
    
    dayLabel.merge(dayLabelEnter)
      .text((d, i) => {
        return numberToDayName(i).substr(0, 3);
      })
      .attr("text-anchor", "middle")
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w)},
        ${y0Label})`;
      });
  }
}