class YearChart {
  constructor(parent) {

    let width = 950;
    let height = 200;
    this.width = width;
    this.height = height;
    
    this.div = parent.append("div");

    let criterionLabels = ["incidents", "injured", "killed", "total victims"];
    let criterionValues = ["incidentCount", "injuredCount", "killedCount", "totalVictimCount"];
    let critLabelToVal = {};
    criterionLabels.forEach((item, i) => {
      critLabelToVal[item] = criterionValues[i];
    });
    
    let div1 = this.div.append("div")
      .style("display", "block");
    let select = div1.append("select")
      .on("change", () => {
        let criterion = critLabelToVal[select.property("value")];
        console.log("select changed");
        main.updateCriterion(criterion);
      });
    div1.append("h2")
      .text("by year")
      .style("padding-left", "10px")
      .style("display", "inline");
    
    let option = select.selectAll("option").data(criterionLabels);
    option.enter()
      .append("option")
      .text((d) => { return d; });

    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible");
  }

  update(data, criterion) {
    self = this;
    let xMargin = 5;
    let w = (this.width - xMargin * data.length) / data.length;
    let x0 = xMargin + w * 0.5;
    let y0Bar = this.height - 70;
    let y0Label = this.height - 50;

    let maxIncidentCount = 0;
    data.forEach((item) => {
      if (item[criterion] > maxIncidentCount) maxIncidentCount = item[criterion];
    });

    let scaleIncidentCount = (incidentCount) => {
      return incidentCount * y0Bar / maxIncidentCount;
    }
    let rect = this.svg.selectAll("rect.year-bar")
      .data(data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("year-bar", true)
      .attr('y', y0Bar)
      .attr("height", 0);
    
    rect.merge(rectEnter)
      .on("click", (d, i) => {
        main.updateYearRange(d.year, d.year);
      })
      .attr('x', (d, i) => x0 + i * (xMargin + w) - w )
      .transition()
      .duration(main.animation.duration)
      .delay(main.animation.delay)
      .attr("fill", "red")
      .attr("width", w)
      .attr('y', ((d, i) => y0Bar - scaleIncidentCount(d[criterion])))
      .attr("height", (d) => {
        return scaleIncidentCount(d[criterion])
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

      let brush = d3.brushX()
      .extent([[0, 0], [this.width, y0Bar]])
      .on("end", brushed);

      this.svg.selectAll('g').data([1]).enter().append("g")
          .attr("class", "brush")
          .call(brush);
         
      function brushed() {
          let brushPosition = d3.event.selection;
          if(!brushPosition){
            let minYear = 1966, maxYear = 2017;
            main.updateYearRange(minYear, maxYear);
          }else{
            let left = Math.floor((brushPosition[0] - x0 + w + xMargin) / (xMargin+w));
            let right = Math.floor((brushPosition[1] - x0 + w - xMargin) / (xMargin+w));
            let minYear = main.years[left];
            let maxYear = main.years[right];
            main.updateYearRange(minYear, maxYear);
          }
      }
  }
}