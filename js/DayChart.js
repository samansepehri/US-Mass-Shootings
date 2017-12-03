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
    let height = 210;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("display", "block");
    this.title = this.div.append("h2")
      .text("Incidents by day");
    this.svg = this.div.append("svg")
      .style("overflow", "visible")
      .style("padding-left", "50px")
      .attr("width", width)
      .attr("height", height);

    this.gYAxis = this.svg.append("g");
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
      .classed("day-bar", true)
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w) - w * 0.5},
        ${y0Bar})`;
      });
    
    rect.merge(rectEnter)
      .attr("fill", "black")
      .transition()
      .duration(main.animation.duration)
      .delay(main.animation.delay)
      .attr("height", (d) => {
        return scaleCriterion(d[criterion])
      })
      .attr("width", w)
      .attr("transform", (d, i) => {
        return `translate(
        ${x0 + i * (xMargin + w) - w * 0.5},
        ${y0Bar - scaleCriterion(d[criterion])})`;
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
    
    scaleCriterion = d3.scaleLinear()
      .domain([0, data.max(criterion)])
      .range([y0Bar, 0]);
    let yAxis = d3.axisLeft(scaleCriterion);    
    this.gYAxis
      .attr("transform", `translate(0, 0)`)
      .call(yAxis);
  }
}