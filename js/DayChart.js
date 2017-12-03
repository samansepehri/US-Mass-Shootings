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
    let width = 300;
    let height = 300;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("margin-right", "15px")
      .style("display", "block");
    this.title = this.div.append("h2")
      .text("Incidents by day");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  update(data, criterion) {
    let criterionNames = {
      "incidentCount": "Incidents",
      "injuredCount": "Injured",
      "killedCount": "Killed",
      "totalVictimCount": "Victims"
    }
    this.title.text(criterionNames[criterion] + " by day")
    let xMargin = 5;
    let w = (this.width - xMargin * data.length) / data.length;
    let x0 = xMargin + w * 0.5;
    let y0Bar = this.height - 50;
    let y0Label = this.height - 20;

    let scaleCriterion = d3.scaleLinear()
    .domain([0, data.max(criterion)])
    .range([0, y0Bar]);

    let rect = this.svg.selectAll("rect.day-bar")
      .data(data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("day-bar", true);
    
    rect.merge(rectEnter)
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w) - w * 0.5},
        ${y0Bar - scaleCriterion(d[criterion])})`;
      })
      .attr("fill", "black")
      .attr("height", (d) => {
        return scaleCriterion(d[criterion])
      })
      .attr("width", w);
    
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