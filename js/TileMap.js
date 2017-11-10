class TileMap {
  constructor(parent) {
    let width = 500;
    let height = 200;
    this.width = width;
    this.height = height;

    this.div = parent.append("div")
      .style("overflow", "visible");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("overflow", "visible");

    this.tilesByName = {};
  }

  update(tileMapData) {
    let tilesByName = this.tilesByName = {};
    tileMapData.data.forEach((d) => {
      tilesByName[d.name] = {};
    });

    let rowCount = tileMapData.metadata.rowCount;
    let colCount = tileMapData.metadata.colCount;

    let tileMargin = 5;
    let tileWidth = (this.width - tileMargin * (colCount - 1)) / colCount;
    let tileHeight = (this.height - tileMargin * (rowCount - 1)) / rowCount;
    
    let domain = [0, 600];
    let range = ["#ffffff", "#ff0000"];
    let colorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);
    
    let rect = this.svg.selectAll("rect.tile")
      .data(tileMapData.data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("tile", true)
      .style("stroke-width", "1px")
      .style("stroke", "#666666");
    rect.merge(rectEnter)
      .each(function(d) {
        tilesByName[d.name].rect = d3.select(this);
      })
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
      .data(tileMapData.data);
    let txtNameEnter = txtName.enter()
      .append("text")
      .classed("state-name", true);
    txtName.merge(txtNameEnter)
      .each(function (d) {
        tilesByName[d.name].label = d3.select(this);
      })
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
          + tileHeight * 0.5})`;
      });
  }
}