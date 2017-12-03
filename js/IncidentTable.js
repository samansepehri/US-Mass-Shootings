class IncidentTable {
  constructor(parent) {
    
    let width = 1300;
    let height = 200;
    this.width = width;
    this.height = height;
    self =  this;
    this.divHeader = parent.append("div");
    this.tdPadding = 8;
    this.tableHeader = this.divHeader.append("table").style("width", this.width);
    this.thead = this.tableHeader.append("thead");
    let trHead = this.thead.append("tr");
    this.headData = [{name: "Title", ratio: 5},
     {name: "Date", ratio: 2},
     {name: "State", ratio: 1},
     {name: "Killed", ratio: 1},
     {name: "Injured", ratio: 1},
     {name: "Total Victims", ratio: 2},
     {name: "Location", ratio: 3},
     {name: "Area", ratio: 3}];
    
    trHead.selectAll("td").data(this.headData).enter()
      .append("td")
      .attr("width", (d) => (d.ratio/this.headData.sum("ratio")) * this.width - 2*this.tdPadding)
      .text((d) => {
        return d.name;
      });
    
    this.div = parent.append("div")
      .attr("id", "incident-table-div")
      .style("max-height", "300px")
      .style("overflow-y", "scroll");

    this.table = this.div.append("table")
      .style("width", this.width);

    this.tbody = this.table.append("tbody");

    this.hashIdToRow = {};
    this.highlightColor = "#ffeeaa";
  }

  highlight(incidentId) {
    if (this.selectedRow != null) {
      this.selectedRow.style("background-color", null)
    }
    if (incidentId != null) {
      let row = this.hashIdToRow[incidentId];
      this.selectedRow = row;
      this.div.node().scrollTo(0, row.node().offsetTop);
      row.style("background-color", this.highlightColor)
    }
  }

  update(data) {
    let hashIdToRow = this.hashIdToRow = {};
    let highlightColor = this.highlightColor;

    let tr = this.tbody.selectAll("tr").data(data);
    let trEnter = tr.enter()
      .append("tr");
    let trMerged = tr.merge(trEnter)
      .each(function(d, i) {
        hashIdToRow[d.id] = d3.select(this);
      })
      .on("mouseenter", function(d) {
        d3.select(this).style("background-color", highlightColor);
        main.scatterPlot.highlight(d.id);
      })
      .on("mouseleave", function(d) {
        d3.select(this).style("background-color", null)
      });
    tr.exit().remove();

    let td = trMerged
      .selectAll("td").data((d) => {
        return [
          { class: "col-title", value: d.title },
          { class: "col-date", value: formatDate(d.date) },
          { class: "col-state", value: d.state },
          { class: "col-killed", value: d.killed },
          { class: "col-injured", value: d.injured },
          { class: "col-total-victims", value: d.injured + d.killed },
          { class: "col-location", value: d.location },
          { class: "col-area", value: d.area }
        ]
      });
    
    let tdEnter = td.enter()
      .append("td").attr("width", (d, i) =>  {
        return (this.headData[i].ratio / this.headData.sum("ratio")) * this.width - 2 * this.tdPadding;
      })
      .attr("class", (d) => {
        return d.class;
      });
    
    trMerged.selectAll("td.col-title")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-date")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-state")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-killed")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-injured")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-total-victims")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-location")
      .html((d) => { return d.value; });
    trMerged.selectAll("td.col-area")
      .html((d) => { return d.value; });
  }
}