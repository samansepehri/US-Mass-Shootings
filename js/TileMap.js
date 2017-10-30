class TileMap {
  constructor(parent) {
    let width = 500;
    let height = 500;
    this.width = width;
    this.height = height;

    this.div = parent.append("div");
    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height);
  }

  updateMap(tileMapData) {
    let rowCount = tileMapData.metadata.rowCount;
    let colCount = tileMapData.metadata.colCount;

    let tileMargin = 5;
    let tileWidth = (this.width - tileMargin * (colCount - 1)) / colCount;
    let tileHeight = (this.height - tileMargin * (rowCount - 1)) / rowCount;
    
    let domain = [0, 10];
    let range = ["#ff0000", "#00ff00"];
    let colorScale = d3.scaleLinear()
      .domain(domain)
      .range(range);
    
    let rect = this.svg.selectAll("rect.tile")
      .data(tileMapData.data);
    let rectEnter = rect.enter()
      .append("rect")
      .classed("tile", true);
    rect.merge(rectEnter)
      .attr("width", tileWidth)
      .attr("height", tileHeight)
      .attr("fill", (d) => {
        console.log(d.incidentCount);
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