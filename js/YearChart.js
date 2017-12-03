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

  update(data, criterion, mode) {
    console.log(mode);
    self = this;
    let xMargin = 5;
    let w = (this.width - xMargin * data.length) / data.length;
    let x0 = xMargin + w * 0.5;
    let y0Bar = this.height - 70;
    let y0Label = this.height - 50;

    let maxIncidentCount = 1;
    data.forEach((item) => {
      if (item.sum(criterion) > maxIncidentCount) maxIncidentCount = item.sum(criterion);
    });

    let scaleIncidentCount = (incidentCount) => {
      return incidentCount * y0Bar / maxIncidentCount;
    }

    let maxIncidentCountBar = maxIncidentCount;
    let scaleY0Bar = (incidentCount) => {
      return incidentCount * y0Bar / maxIncidentCount;
    }

    let domain = [0, 10, 20, 30, 40, 50];
    let range = ["#ffff00", "#00c922","#0000f6", "#f032e6",'#efd091'];
    let stateColorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);


    let g = this.svg.selectAll('g.year-bar')
            .data(data);
            let gEnter = g.enter()
            .append('g')
            .classed('year-bar', true)
            .on("click", (d) => {
              main.updateYearRange(d.year, d.year);
            });
    
    let rect = g.selectAll("rect.year-portion")
      .data(function(d, i) {
         return d;
      });

    let rectEnter = rect.enter()
      .append("rect")
      .classed("year-portion", true)
      .attr('y', y0Bar)
      .attr('height', 0);
    
    rect.merge(rectEnter)
      .attr('x', (d, i) => x0 + main.years.indexOf(d.year) * (xMargin + w) - w )
      .attr("fill", (d) => mode =='default'?'red': stateColorScale(main.allStates.indexOf(d.state)))
      .transition()
      .duration(main.animation.duration)
      .delay(main.animation.delay)
      .attr("width", w)
      .attr('y',  ((d, i) => {
        if(mode=='default'){
         return y0Bar - scaleIncidentCount(d[criterion])
        }
        if(mode=='forStates'){
         return y0Bar - scaleIncidentCount(d[criterion+'Sum'])
        }
      }))
      .attr("height", (d) => {
        return scaleIncidentCount(d[criterion])
      });

      rect.exit().remove();
    
    let yearLabel = this.svg.selectAll("text.year-label")
      .data(data);
    let yearLabelEnter = yearLabel.enter()
      .append("text")
      .classed("year-label", true)
    
    yearLabel.merge(yearLabelEnter)
      .text((d, i) => {
        return main.years[i];
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
      .extent([[0, y0Bar + 1], [this.width, this.height - 30 ]])
      .on("end", brushed);

      this.svg.selectAll('g.brush').data([1]).enter().append("g")
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
  updateByState(filteredData, criterion){
    let rect = this.svg.selectAll("rect.year-bar");
    console.log(rect);
    rect.each(function(d, i){
      d3.select(this).classed('year-highlighted', false).attr('fill', 'red');
      if( filteredData[i][criterion] > 0 ){
        d3.select(this).classed('year-highlighted', true).attr('fill', 'green');
      } 
    });

  }
}