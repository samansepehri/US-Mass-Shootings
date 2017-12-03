class ScatterPlot {
  constructor(parent) {
    let width = 250;
    let height = 250;
    this.width = width;
    this.height = height;

    this.itemRadius = 4;

    this.div = parent.append("div")
      .style("overflow", "visible")
      .style("display", "inline-block");
    this.div.append("h2")
      .text("Scatter plot, killed-injured");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .style("overflow", "visible")
      .style("padding-left", "50px")
      .style("padding-bottom", "40px");

    this.gXAxis = this.svg.append("g");
    this.gYAxis = this.svg.append("g");
    this.xLabel = this.svg.append("text")
      .text("killed")
      .attr("text-anchor", "middle");
    this.yLabel = this.svg.append("text")
      .text("injured")
      .attr("text-anchor", "middle");

    let legendData = this.legendData = [0, 1, 2, 3, 4];
    let legendRect = this.svg.selectAll("rect.sp-legend-rect").data(legendData);
    let legendRectEnter = legendRect.enter().append("rect")
      .classed("sp-legend-rect", true);
    
    let legendLabel = this.svg.selectAll("text.sp-legend-label").data(legendData);
    let legendLabelEnter = legendLabel.enter().append("text")
      .classed("sp-legend-label", true);

    this.legendTitle = this.svg.append("text").text("Victims")
      .attr("text-anchor", "middle");

    this.divTooltip = this.div.append("div")
      .style("position", "absolute")
      .style("cursor", "default")
      .style("background-color", "white")
      .style("border", "1px solid black")
      .style("padding", "5px")
      .style("visibility", "hidden")
      .style("pointer-events", "none");
    this.divTooltipTitle = this.divTooltip.append("div");

    this.hashIdToCircle = {};
    this.selectedCircle = null;
  }

  highlight(incidentId) {
    if (this.selectedCircle != null) {
      this.selectedCircle.attr("r", this.itemRadius)
    }
    if (incidentId != null) {
      let circle = this.hashIdToCircle[incidentId];
      this.selectedCircle = circle;
      circle.attr("r", this.itemRadius * 1.5)
    }
  }

  update(data) {
    let hashIdToCircle = this.hashIdToCircle = {};

    let maxInjured = 0;
    let maxKilled = 0;
    let minVictims = Number.MAX_SAFE_INTEGER;
    let maxVictims = 0;
    for (let i = 0; i < data.length; i++) {
      let item = data[i];
      let injured = item.injured;
      let killed = item.killed;
      let victims = injured + killed;
      if (injured > maxInjured) maxInjured = injured;
      if (killed > maxKilled) maxKilled = killed;
      if (victims > maxVictims) maxVictims = victims;
      if (victims < minVictims) minVictims = victims;
    }

    let xMax = Math.max(maxKilled, maxInjured);
    let yMax = xMax;
    let xScale = d3.scaleLinear()
      .domain([0, xMax])
      .range([0, this.width]);
    let yScale = d3.scaleLinear()
      .domain([0, yMax])
      .range([this.height, 0]);

    let xAxis = d3.axisBottom(xScale);
    this.gXAxis
      .attr("transform", `translate(0, ${this.height})`)
      .call(xAxis);
    this.xLabel
      .attr("transform", `translate(${this.width * 0.5}, ${this.height + 30})`);
    
    let yAxis = d3.axisLeft(yScale);    
    this.gYAxis
      .attr("transform", `translate(0, 0)`)
      .call(yAxis);
    this.yLabel
      .attr("transform", `translate(${-30}, ${this.height * 0.5}) rotate(-90) `)

    let colorScale = d3.scaleLinear()
      .domain([0, maxVictims])
      .range(["#ffffff", "#ff0000"]);

    let divTooltip = this.divTooltip;
    let divTooltipTitle = this.divTooltipTitle;

    let circle = this.svg.selectAll("circle.incident-point").data(data);
    let circleEnter = circle.enter()
      .append("circle")
      .attr("fill", "#0000aa")
      .style("stroke", "black")
      .classed("incident-point", true);
    circle.merge(circleEnter)
      .each(function(d, i) {
        hashIdToCircle[d.id] = d3.select(this);
      })
      .attr("cx", (d) => { return xScale(d.killed); })
      .attr("cy", (d) => { return yScale(d.injured); })
      .attr("r", this.itemRadius)
      .attr("fill", (d) => {
        let victims = d.injured + d.killed;
        return colorScale(victims);
      })
      .on("mouseout", function(d) {
        divTooltip.style("visibility", "hidden");
        main.incidentTable.highlight(null);
      })
      .on("mouseenter", function(d) {
        let mousePos = d3.mouse(document.body);
        let left = (mousePos[0] + 15) + "px";
        let top = (mousePos[1] + 10) + "px";
        divTooltip
          .style("left", left)
          .style("top", top)
          .style("visibility", "visible");

        let tooltipText = /* "date: " + formatDate(d.date) + "<br>state: " + d.state + "<br>" + */ "killed: " + d.killed + "<br>injured: " + d.injured + "<br>total victims: " + (d.injured + d.killed);
         
        divTooltipTitle.html(tooltipText);
        main.incidentTable.highlight(d.id);
      });

    circle.exit()
      .remove();
    
    let legendItemCount = this.legendData.length;
    let legendHeight = this.height / 3;
    let legendRectHeight = legendHeight / legendItemCount;
    let legendRectWidth = 20;
    let legendXOffset = 30;
    let legendRect = this.svg.selectAll("rect.sp-legend-rect")
      .style("stroke", "black")
      .attr("height", legendRectHeight)
      .attr("width", legendRectWidth)
      .attr("transform", (d, i) => {
        return `translate(
          ${legendXOffset + this.width - legendRectWidth * 0.5},
          ${(legendItemCount - 1 - i) * legendRectHeight - legendHeight * 0.5 + this.height * 0.5})`
      })
      .attr("fill", (d, i) => {
        return colorScale(Math.floor(i / (legendItemCount - 1) * maxVictims));
      });

    let legendLabel = this.svg.selectAll("text.sp-legend-label")
      .text((d, i) => {
        return Math.floor(i / (legendItemCount - 1) * maxVictims).toString();
      })
      .attr("dy", "0.5em")
      .attr("transform", (d, i) => {
        return `translate(
          ${legendXOffset + this.width - legendRectWidth * 0.5 + 30},
          ${(legendItemCount - 1 - i) * legendRectHeight - legendHeight * 0.5 + this.height * 0.5
          + legendRectHeight * 0.5})`
      });
    
    this.legendTitle.attr("transform", `translate(
      ${legendXOffset + this.width},
      ${this.height * 0.5 - legendHeight * 0.5 - 10})`);
  }
}