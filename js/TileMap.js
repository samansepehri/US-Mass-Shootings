class TileMap {
  constructor(parent) {
    let width = 700;
    let height = 350;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("overflow", "visible");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("overflow", "visible");
  }

  update(data) {
    let rowCount = data.metadata.rowCount;
    let colCount = data.metadata.colCount;

    let tileMargin = 5;
    let tileWidth = (this.width - tileMargin * (colCount - 1)) / colCount;
    let tileHeight = (this.height - tileMargin * (rowCount - 1)) / rowCount;

    // TODO link criterion with rest of the visualization
    let criterion = "incidentCount";
    let maxNumber = 0;
    data.data.forEach((item) => {
      let number = item[criterion];
      if (number > maxNumber) maxNumber = number;
    });
    
    let domain = [0, maxNumber];
    let range = ["#ffffff", "#ff0000"];
    let colorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);
    
    let rect = this.svg.selectAll("rect.tile")
      .data(data.data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("tile", true)
      .style("stroke-width", "1px")
      .style("stroke", "#666666");
    rect.merge(rectEnter)
      .attr("width", tileWidth)
      .attr("height", tileHeight)
      .attr("fill", (d) => {
        return colorScale(d.incidentCount);
      })
      .attr("transform", (d) => {
        return `translate(
          ${d.col * tileWidth  + (d.col - 1) * tileMargin},
          ${d.row * tileHeight + (d.row - 1) * tileMargin})`;
      });

    let txtName = this.svg.selectAll("text.state-name")
      .data(data.data);
    let txtNameEnter = txtName.enter()
      .append("text")
      .classed("state-name", true);
    txtName.merge(txtNameEnter)
      .text((d) => {
        return d.name;
      })
      .style("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("transform", (d) => {
        return `translate(
          ${d.col * tileWidth  + (d.col - 1) * tileMargin
          + tileWidth * 0.5},
          ${d.row * tileHeight + (d.row - 1) * tileMargin
          + tileHeight * 0.25})`;
      });

    let txtNumber = this.svg.selectAll("text.state-number")
      .data(data.data);
    let txtNumberEnter = txtNumber.enter()
      .append("text")
      .classed("state-number", true);
    txtNumber.merge(txtNumberEnter)
      .text((d) => {
        return d[criterion];
      })
      .style("pointer-events", "none")
      .attr("text-anchor", "middle")
      .attr("dy", 5)
      .attr("transform", (d) => {
        return `translate(
          ${d.col * tileWidth  + (d.col - 1) * tileMargin
          + tileWidth * 0.5},
          ${d.row * tileHeight + (d.row - 1) * tileMargin
          + tileHeight * 0.75})`;
      });
  }
}