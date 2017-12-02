class TileMap {
  constructor(parent) {
    let width = 950;
    let height = 350;
    this.width = width;
    this.height = height;
    this.selectedStates = [];
    let self = this;

    this.div = parent.append("div")
      .style("overflow", "visible")
      .style('margin-left', '10px');

    let div1 = this.div.append("div")
      .style("display", "block");
    let button = div1.append("button")
      .text('Clear states selection')
      .style("margin-bottom", "20px")
      .style("display", "inline")
      .on("click", () => {
        self.clearSelection();
        self.selectedStates = [];
        main.updateStateList(self.selectedStates);        
      });

    this.svg = this.div.append("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("overflow", "visible");

  }
  clearSelection() {
    console.log('Clear state selection');
    let rect = this.svg.selectAll("rect.tile");
    rect.classed('selected-state', false).transition().duration(main.animation.duration).style("stroke-width", "1px")
    .style("stroke", "#666666");
  }

  update(data, criterion) {
    self = this;
    let rowCount = data.metadata.rowCount;
    let colCount = data.metadata.colCount;

    let tileMargin = 5;
    let tileWidth = (this.width - tileMargin * (colCount - 1)) / colCount;
    let tileHeight = (this.height - tileMargin * (rowCount - 1)) / rowCount;

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
      .classed('selected-state', false)
      .style("stroke-width", "1px")
      .style("stroke", "#666666");
      
    rect.merge(rectEnter)
      .attr("width", tileWidth)
      .attr("height", tileHeight)
      .attr("transform", (d) => {
        return `translate(
          ${d.col * tileWidth  + (d.col - 1) * tileMargin},
          ${d.row * tileHeight + (d.row - 1) * tileMargin})`;
      })
      //.transition()
      //.duration(main.animation.duration)
      .attr("fill", (d) => {
        return colorScale(d[criterion]);
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

      rect.merge(rectEnter).on('click', function(d,i){
        if(d3.select(this).classed('selected-state')){
          d3.select(this).classed('selected-state', false)
          .transition()
          .duration(main.animation.duration)
          .style("stroke-width", "1px")
          .style("stroke", "#666666");
          self.selectedStates.splice(self.selectedStates.indexOf(d.name),1);
        }else{
          d3.select(this).classed('selected-state', true)
          .transition()
          .duration(main.animation.duration)
          .style("stroke-width", "4px")
          .style("stroke", "#666666");
          self.selectedStates.push(d.name);
        }
        main.updateStateList(self.selectedStates);
      })
  }
}